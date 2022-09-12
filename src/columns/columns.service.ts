import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';
import { Board } from '../boards/entities/board.entity';

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

  findAll() {
    return `This action returns all columns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
