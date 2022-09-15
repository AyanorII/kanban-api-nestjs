import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '../boards/entities/board.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const { name, boardId } = createColumnDto;

    const column = await new Column();
    const board = await Board.findOneOrFail({ where: { id: boardId } });

    column.name = name;
    column.board = board;

    await column.save();

    return column;
  }

  async findAll(): Promise<Column[]> {
    const columns = await Column.find();

    return columns;
  }

  async findOne(id: number): Promise<Column> {
    const column = await Column.findOneOrFail({
      where: { id },
      relations: ['board'],
    });

    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const { name, boardId } = updateColumnDto;

    const column = await Column.findOne({
      where: { id },
      relations: ['board'],
    });

    if (!column) {
      throw new NotFoundException(`Column with ID: '${id}' not found.`);
    }

    if (name) {
      column.name = name;
    }

    if (boardId) {
      const board = await Board.findOne({ where: { id: boardId } });

      if (!board) {
        throw new NotFoundException(`Board with ID: '${boardId}' not found.`);
      }

      column.board = board;
    }

    await column.save();
    return column;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
