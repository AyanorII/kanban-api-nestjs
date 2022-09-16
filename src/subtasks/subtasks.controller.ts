import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Subtask } from './entities/subtask.entity';
import { SubtasksService } from './subtasks.service';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  async create(@Body() createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    return this.subtasksService.create(createSubtaskDto);
  }

  @Get()
  async findAll(): Promise<Subtask[]> {
    return this.subtasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Subtask> {
    return this.subtasksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<Subtask> {
    return this.subtasksService.update(id, updateSubtaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(+id);
  }
}
