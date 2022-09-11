import { validate } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class BoardsService {
  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const { name } = createBoardDto;

    const board = new Board();
    board.name = name;

    const errors = await validate(board);

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors[0].property}`);
    } else {
      await board.save();
      return board;
    }
  }

  async findAll(): Promise<Board[]> {
    const boards = await Board.find();

    return boards;
  }

  async findOne(id: number): Promise<Board> {
    const board = await Board.findOneOrFail({ where: { id } });

    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const { name } = updateBoardDto;

    const board = await Board.findOneOrFail({ where: { id } });

    board.name = name;
    await board.save();
    return board;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
