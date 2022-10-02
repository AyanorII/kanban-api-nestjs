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
import { Subtask, User } from '@prisma/client';
import { GetUser } from 'src/get-user.decorator';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtasksService } from './subtasks.service';

@ApiTags('Subtasks')
@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  async create(
    @Body() createSubtaskDto: CreateSubtaskDto,
    @GetUser() user: User,
  ): Promise<Subtask> {
    return this.subtasksService.create(createSubtaskDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<Subtask[]> {
    return this.subtasksService.findAll(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Subtask> {
    return this.subtasksService.findOne(id, user);
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
