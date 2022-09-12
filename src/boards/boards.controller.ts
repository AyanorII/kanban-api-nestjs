import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { EntityNotFoundError } from 'typeorm';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    const board = await this.boardsService.create(createBoardDto);

    return board;
  }

  @Get()
  async findAll() {
    const boards = await this.boardsService.findAll();

    return boards;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const board = await this.boardsService.findOne(id);
      return board;
    } catch (err) {
      throw new NotFoundException(`Board with ID: ${id} not found`);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    try {
      const board = await this.boardsService.update(id, updateBoardDto);
      return board;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException(`Board with ID: ${id} not found`);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const board = await this.boardsService.remove(id);
      return board;
    } catch (err) {
      throw new NotFoundException(`Board with ID: ${id} not found`);
    }
  }
}
