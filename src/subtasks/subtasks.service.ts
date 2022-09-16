import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Subtask } from './entities/subtask.entity';

@Injectable()
export class SubtasksService {
  constructor(private tasksService: TasksService) {}

  async create(createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    const { title, completed, taskId } = createSubtaskDto;

    const task = await this.tasksService.findOne(taskId);

    const subtask = Subtask.create({ title, completed, task });
    await subtask.save();

    return subtask;
  }

  async findAll(): Promise<Subtask[]> {
    return Subtask.find();
  }

  async findOne(id: number): Promise<Subtask> {
    const subtask = await Subtask.findOne({
      where: { id },
      relations: ['task'],
    });

    if (!subtask) {
      throw new NotFoundException(`Subtask with ID: ${id} not found.`);
    }

    return subtask;
  }

  update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
    return `This action updates a #${id} subtask`;
  }

  remove(id: number) {
    return `This action removes a #${id} subtask`;
  }
}
