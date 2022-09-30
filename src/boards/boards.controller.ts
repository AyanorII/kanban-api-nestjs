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
import { ApiTags } from '@nestjs/swagger';
import { Board, Column } from '@prisma/client';
// import { ColumnsService } from '../columns/columns.service';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    const board = await this.boardsService.create(createBoardDto);

    return board;
  }

  @Get()
  async findAll(): Promise<Board[]> {
    const boards = await this.boardsService.findAll();

    return boards;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardsService.update(id, updateBoardDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.boardsService.remove(id);
  }

  @Get(':id/columns')
  async findBoardColumns(@Param('id') id: number): Promise<Column[]> {
    return this.boardsService.findBoardColumns(id);
  }
}
