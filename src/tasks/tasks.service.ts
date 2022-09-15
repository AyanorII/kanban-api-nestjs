import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateValuesMissingError } from 'typeorm';
import { ColumnsService } from '../columns/columns.service';
import { Column } from '../columns/entities/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusColumn } from './dto/update-status-column.dto';
import { UpdateTaskTitleDescription } from './dto/update-title-description.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private columnsService: ColumnsService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, status, columnId } = createTaskDto;

    const column = await Column.findOne({ where: { id: columnId } });

    if (!column) {
      throw new NotFoundException(`Column with ID: '${columnId}' not found.`);
    }

    const task = Task.create({ title, description, status, column });
    await task.save();
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

  /**
   * Updates only the title and/or description of a Task instance.
   * @param id Task ID.
   * @param updateTaskDto Object containing the title and/or description to be updated.
   * @returns The updated instance of the Task entity or throws an error if no data was given.
   */
  async updateTitleAndDescription(
    id: number,
    updateTaskDto: UpdateTaskTitleDescription,
  ): Promise<Task> {
    try {
      await Task.update(id, updateTaskDto);
      const task = await this.findOne(id);

      return task;
    } catch (err) {
      if (err instanceof UpdateValuesMissingError) {
        throw new BadRequestException(err.message.split('.')[0]);
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

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
