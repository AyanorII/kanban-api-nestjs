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
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Subtask, Task } from '@prisma/client';
import { SubtasksService } from '../subtasks/subtasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusColumnDto } from './dto/update-task-status-column.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
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
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Patch(':id/status')
  async createTaskSubtask(
    @Param('id') id: number,
    @Body() updateTaskStatusColumnDto: UpdateTaskStatusColumnDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusColumnDto);
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
