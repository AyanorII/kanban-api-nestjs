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
import { Subtask, Task, User } from '@prisma/client';
import { GetUser } from 'src/get-user.decorator';
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
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @GetUser() user: User): Promise<Task> {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
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
  async findTaskSubtasks(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Subtask[]> {
    return this.subtasksService.findTaskSubtasks(id, user);
  }
}
