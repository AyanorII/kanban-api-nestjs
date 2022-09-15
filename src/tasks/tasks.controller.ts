import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusColumn } from './dto/update-status-column.dto';
import { UpdateTaskTitleDescription } from './dto/update-title-description.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

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
  ) {
    return this.tasksService.updateTitleAndDescription(id, updateTaskDto);
  }

  @Patch(':id/status')
  async updateStatusAndColumn(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskStatusColumn,
  ) {
    return this.tasksService.updateStatusAndColumn(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
