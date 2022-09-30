import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Subtask } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskCompletedDto } from './dto/update-subtask-completed.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(
    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService,
    private prisma: PrismaService,
  ) {}

  async create(createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    try {
      const subtask = await this.prisma.subtask.create({
        data: { ...createSubtaskDto },
      });

      return subtask;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Task with ID: '${createSubtaskDto.taskId}' does not exist.`,
          );
        }
      }
    }
  }

  async findAll(): Promise<Subtask[]> {
    return this.prisma.subtask.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number): Promise<Subtask> {
    const subtask = await this.prisma.subtask.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!subtask) {
      throw new NotFoundException(`Subtask with ID: ${id} not found.`);
    }

    return subtask;
  }

  async update(
    id: number,
    updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<Subtask> {
    try {
      const subtask = await this.prisma.subtask.update({
        where: { id },
        data: { ...updateSubtaskDto },
      });

      return subtask;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        Logger.debug(error.message);
        Logger.debug(error.code);
        if (error.code === 'P2025') {
          throw new NotFoundException(`Subtask with ID: '${id}' not found.`);
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.subtask.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Subtask with ID: '${id}' not found.`);
        }
      }
    }
  }

  async updateSubtaskCompleted(
    id: number,
    updateSubtaskCompletedDto: UpdateSubtaskCompletedDto,
  ): Promise<Subtask> {
    try {
      const subtask = await this.prisma.subtask.update({
        where: { id },
        data: updateSubtaskCompletedDto,
        include: { task: true },
      });

      return subtask;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Subtask with ID: '${id}' not found.`);
        }
      }
    }
  }

  async findTaskSubtasks(id: number): Promise<Subtask[]> {
    try {
      const subtasks = await this.prisma.subtask.findMany({
        where: { taskId: id },
        orderBy: { id: 'asc' },
      });

      if (subtasks.length === 0) {
        await this.tasksService.findOne(id);
      }

      return subtasks;
    } catch (error) {
      throw new NotFoundException(`Task with ID: '${id}' not found.`);
    }
  }
}
