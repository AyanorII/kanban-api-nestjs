import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateValuesMissingError } from 'typeorm';
import { Column } from '../columns/entities/column.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
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

  async findOne(id: number): Promise<Task> {
    const task = await Task.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found.`);
    }

    return task;
  }

  async updateTitleAndDescription(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { title, description } = updateTaskDto;

    try {
      await Task.update(id, { title, description });
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
