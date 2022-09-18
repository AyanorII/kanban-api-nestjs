import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateValuesMissingError } from 'typeorm';
import { ColumnsService } from '../columns/columns.service';
import { CreateSubtaskDto } from '../subtasks/dto/create-subtask.dto';
import { SubtasksService } from '../subtasks/subtasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusColumn } from './dto/update-status-column.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    private columnsService: ColumnsService,
    @Inject(forwardRef(() => SubtasksService))
    private subtasksService: SubtasksService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, columnId, subtasks } = createTaskDto;

    const column = await this.columnsService.findOne(columnId);
    const task = Task.create({ title, description, status, column });
    await task.save();

    if (subtasks?.length > 1) {
      const subtasksPromise = subtasks
        .filter((subtask) => subtask.title !== '')
        .map(
          async (subtask) =>
            await this.subtasksService.create({ ...subtask, taskId: task.id }),
        );
      await Promise.all(subtasksPromise);
    }
    return task;
  }

  async findAll(): Promise<Task[]> {
    return Task.find();
  }

  /**
   * Returns a Task instance.
   * @param id The task instance ID.
   * @returns A task entity instance or throws a NotFoundException if no task was found with the given ID.
   */
  async findOne(id: number): Promise<Task> {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found.`);
    }

    return task;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { subtasks, columnId, ...rest } = updateTaskDto;

    try {
      const column = await this.columnsService.findOne(columnId);

      await Task.update(id, { ...rest, column });
      const task = await this.findOne(id);
      const subtasksPromise = subtasks
        .filter((subtask) => subtask.title !== '')
        .map((subtask) => {
          const { taskId, ...rest } = subtask;
          return subtask.id
            ? this.subtasksService.update(subtask.id, rest)
            : this.subtasksService.create(subtask as CreateSubtaskDto);
        });

      await Promise.all(subtasksPromise);

      return task;
    } catch (err: any) {
      if (err instanceof UpdateValuesMissingError) {
        throw new BadRequestException(err.message.split('.')[0]);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  /**
   * Updates only the status and/or columnId of a Task instance.
   * @param id Task ID
   * @param updateTaskDto Object containing the status and/or columnId to be updated.
   * @returns The updated instance of the Task entity or throws an error if no data was given.
   */
  async updateStatusAndColumn(
    id: number,
    updateTaskDto: UpdateTaskStatusColumn,
  ): Promise<Task> {
    const { status, columnId } = updateTaskDto;

    const column = await this.columnsService.findOne(columnId);

    try {
      await Task.update(id, { status, column });
      const task = await this.findOne(id);

      return task;
    } catch (err) {
      if (err instanceof UpdateValuesMissingError) {
        throw new BadRequestException(err.message.split('.')[0]);
      }
    }
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.remove();
  }

  async findColumnTasks(columnId: number): Promise<Task[]> {
    const column = await this.columnsService.findOne(columnId);

    const query = Task.createQueryBuilder('task');
    query.where({ column });
    const tasks = await query.getMany();
    return tasks;
  }
}
