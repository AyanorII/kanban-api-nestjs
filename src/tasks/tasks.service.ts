import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { SubtasksService } from 'src/subtasks/subtasks.service';
import { ColumnsService } from '../columns/columns.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusColumnDto } from './dto/update-task-status-column.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private columnsService: ColumnsService,
    @Inject(forwardRef(() => SubtasksService))
    private subtasksService: SubtasksService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, status, subtasks, columnId } = createTaskDto;

    if (status === '') {
      throw new ConflictException(`Status cannot be empty.`);
    }
    await this.checkStatusAndColumnMatch(status, columnId, user);

    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          status,
          columnId,
          userId: user.id,
          subtasks: {
            createMany: {
              data:
                subtasks.length > 0
                  ? subtasks
                      .filter((subtask) => subtask.title !== '')
                      .map(({ title, completed }) => ({
                        title,
                        completed,
                        userId: user.id,
                      }))
                  : [],
            },
          },
        },
        include: { subtasks: true },
      });

      return task;
    } catch (error) {
      Logger.verbose(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Column with ID: '${columnId}' does not exist.`,
          );
        }
      }
    }
  }

  async findAll(user: User): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Returns a Task instance.
   * @param id The task instance ID.
   * @returns A task entity instance or throws a NotFoundException if no task was found with the given ID.
   */
  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId: user.id },
      include: { subtasks: true, column: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID: '${id}' not found.`);
    }

    return task;
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { subtasks, columnId, status, ...rest } = updateTaskDto;

    if (columnId && status) {
      await this.checkStatusAndColumnMatch(status, columnId, user);
    }

    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: { ...rest, columnId, status },
        include: { subtasks: true },
      });

      await this.updateSubtasks(subtasks, task, user);

      return task;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Task with ID: '${id}' not found.`);
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Column with ID: ${updateTaskDto.columnId} does not exist.`,
          );
        }
      }
    }
  }

  async updateTaskStatus(
    id: number,
    updateTaskStatusColumnDto: UpdateTaskStatusColumnDto,
  ): Promise<Task> {
    const { status, columnId } = updateTaskStatusColumnDto;

    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: { status, columnId },
        include: { subtasks: true, column: true },
      });

      return task;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException(`Task with ID: ${id} not found.`);
        } else if (err.code === 'P2003') {
          throw new NotFoundException(
            `Column with ID: ${columnId} does not exist.`,
          );
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.task.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Task with ID: ${id} not found.`);
        }
      }
    }
  }

  async findColumnTasks(columnId: number, user: User): Promise<Task[]> {
    const column = await this.columnsService.findOne(columnId, user);

    return this.prisma.task.findMany({
      where: { columnId: column.id, userId: user.id },
      orderBy: { id: 'asc' },
    });
  }

  /* ---------------------------- Private methods --------------------------- */

  private async updateSubtasks(
    subtasks: UpdateTaskDto['subtasks'],
    task: Task,
    user: User,
  ) {
    if (subtasks?.length >= 1) {
      const subtasksPromise = subtasks
        .filter((subtask) => subtask.title !== '')
        .map(async (subtask) => {
          const { id, title, completed } = subtask;

          if (id) {
            await this.subtasksService.update(id, { title, completed });
          } else {
            await this.subtasksService.create(
              {
                title,
                taskId: task.id,
              },
              user,
            );
          }
        });

      const subtasksUpdated = await Promise.all(subtasksPromise);
      return subtasksUpdated;
    }
  }

  private async checkStatusAndColumnMatch(
    status: string,
    columnId: number,
    user: User,
  ): Promise<boolean> {
    const column = await this.columnsService.findOne(columnId, user);
    if (status !== column.name) {
      throw new ConflictException(
        `Column name: '${column.name}' does not match the status: '${status}'.`,
      );
    }
    return true;
  }
}
