import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Board, Column, User } from '@prisma/client';
import { GetUser } from 'src/get-user.decorator';
// import { ColumnsService } from '../columns/columns.service';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('Boards')
@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  async create(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    const board = await this.boardsService.create(createBoardDto);

    return board;
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<Board[]> {
    const boards = await this.boardsService.findAll();

    return boards;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.update(id, updateBoardDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.boardsService.remove(id);
  }

  @Get(':id/columns')
  async findBoardColumns(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Column[]> {
    return this.boardsService.findBoardColumns(id);
  }
}
