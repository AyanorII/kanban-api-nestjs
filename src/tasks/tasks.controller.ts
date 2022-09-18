import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { Subtask } from '../subtasks/entities/subtask.entity';
import { SubtasksService } from '../subtasks/subtasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusColumn } from './dto/update-status-column.dto';
import { UpdateTaskTitleDescription } from './dto/update-title-description.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private subtasksService: SubtasksService,
    private tasksService: TasksService,
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  async updateTitleAndDescription(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskTitleDescription,
  ): Promise<Task> {
    return this.tasksService.updateTitleAndDescription(id, updateTaskDto);
  }

  @Patch(':id/status')
  async updateStatusAndColumn(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskStatusColumn,
  ): Promise<Task> {
    return this.tasksService.updateStatusAndColumn(id, updateTaskDto);
  }

  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Get(':id/subtasks')
  async findTaskSubtasks(@Param('id') id: number): Promise<Subtask[]> {
    return this.subtasksService.findTaskSubtasks(id);
  }
}
