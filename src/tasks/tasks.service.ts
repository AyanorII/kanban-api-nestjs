import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ColumnsService } from '../columns/columns.service';
// import { SubtasksService } from '../subtasks/subtasks.service';
import { Task } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { SubtasksService } from 'src/subtasks/subtasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private columnsService: ColumnsService,
    private subtasksService: SubtasksService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, columnId, subtasks } = createTaskDto;

    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          status,
          columnId,
          subtasks: { createMany: { data: subtasks } },
        },
        include: { subtasks: true },
      });

      return task;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Column with ID: '${columnId}' does not exist.`,
          );
        }
      }
    }
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({ orderBy: { id: 'asc' } });
  }

  /**
   * Returns a Task instance.
   * @param id The task instance ID.
   * @returns A task entity instance or throws a NotFoundException if no task was found with the given ID.
   */
  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { subtasks: true, column: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID: '${id}' not found.`);
    }

    return task;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { subtasks, columnId, status, ...rest } = updateTaskDto;

    // Checks if columnId and status are present, and if so, checks if column name and status match, if not, throws a ConflictException.
    if (columnId && status) {
      const column = await this.columnsService.findOne(columnId);
      if (column.name !== status) {
        throw new ConflictException(
          `Column name: '${column.name}' does not match the status: '${status}'.`,
        );
      }
    }

    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: { ...rest, columnId, status },
        include: { subtasks: true },
      });

      await this.updateSubtasks(subtasks, task);

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

  async findColumnTasks(columnId: number): Promise<Task[]> {
    const column = await this.columnsService.findOne(columnId);

    return this.prisma.task.findMany({ where: { columnId: column.id } });
  }

  /* ---------------------------- Private methods --------------------------- */

  private async updateSubtasks(
    subtasks: UpdateTaskDto['subtasks'],
    task: Task,
  ) {
    if (subtasks?.length >= 1) {
      const subtasksPromise = subtasks
        .filter((subtask) => subtask.title !== '')
        .map(async (subtask) => {
          const { id, title, completed } = subtask;

          if (id) {
            await this.subtasksService.update(id, { title, completed });
          } else {
            await this.subtasksService.create({
              title,
              taskId: task.id,
            });
          }
        });

      const subtasksUpdated = await Promise.all(subtasksPromise);
      return subtasksUpdated;
    }
  }
}
