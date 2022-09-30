import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Subtask } from '@prisma/client';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtasksService } from './subtasks.service';

@ApiTags('Subtasks')
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

  @Patch(':id/completed')
  async updateSubtaskCompleted(
    @Param('id') id: number,
    @Body() updateSubtaskDto: UpdateSubtaskDto,
  ): Promise<Subtask> {
    return this.subtasksService.updateSubtaskCompleted(id, updateSubtaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.subtasksService.remove(id);
  }
}
