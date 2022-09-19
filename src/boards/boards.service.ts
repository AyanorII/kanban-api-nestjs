import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ColumnsService } from '../columns/columns.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(forwardRef(() => ColumnsService))
    private columnsService: ColumnsService,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const { name, columns } = createBoardDto;

    const board = new Board();
    board.name = name;
    await board.save();

    if (columns.length) {
      const columnsPromise = columns
        .filter((column) => typeof column === 'string')
        .map((column) =>
          this.columnsService.create({ name: column, boardId: board.id }),
        );

      Promise.all(columnsPromise);
    }

    return board;
  }

  async findAll(): Promise<Board[]> {
    const boards = await Board.find();

    return boards;
  }

  async findOne(id: number): Promise<Board> {
    const board = await Board.findOne({
      where: { id },
      relations: ['columns'],
    });

    if (!board) {
      throw new NotFoundException(`Board with ID: ${id} not found.`);
    }

    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const { name } = updateBoardDto;

    const board = await this.findOne(id);

    board.name = name;
    await board.save();
    return board;
  }

  async remove(id: number): Promise<Board> {
    const board = await this.findOne(id);
    await board.remove();
    return board;
  }
}
