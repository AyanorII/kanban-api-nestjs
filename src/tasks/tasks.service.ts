import { Injectable, NotFoundException } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
