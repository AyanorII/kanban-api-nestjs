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

  async update(
    id: number,
    updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<Subtask> {
    const { title, completed, taskId } = updateSubtaskDto;

    const task = await this.tasksService.findOne(taskId);

    await Subtask.update(id, { title, completed, task });
    const subtask = await this.findOne(id);
    await subtask.save();

    return subtask;
  }

  async remove(id: number): Promise<void> {
    const subtask = await this.findOne(id);
    await subtask.remove();
  }

  async findTaskSubtasks(taskId: number): Promise<Subtask[]> {
    const task = await this.tasksService.findOne(taskId);

    const subtasks = await Subtask.createQueryBuilder('subtask')
      .where({ task })
      .getMany();

    return subtasks;
  }
}
