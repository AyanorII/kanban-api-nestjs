import { validate } from '@nestjs/class-validator';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

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

  findAll() {
    return `This action returns all boards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
