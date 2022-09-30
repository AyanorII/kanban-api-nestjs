import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board, Column } from '@prisma/client';
import { ColumnsService } from '../columns/columns.service';
import { CreateColumnDto } from '../columns/dto/create-column.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class BoardsService {
  constructor(
    private prisma: PrismaService,
    private columnsService: ColumnsService,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const { name, columns } = createBoardDto;

    if (await this.boardNameAlreadyExists(name)) {
      throw new ConflictException(`Board with name '${name}' already exists.`);
    }

    const filteredColumns = this.getUniqueColumnNames(columns);

    const board = await this.prisma.board.create({
      data: {
        name,
        columns: {
          createMany: {
            data: filteredColumns.map((column) => ({
              ...column,
              color: this.columnsService.generateColumnColor(),
            })),
          },
        },
      },
      include: { columns: true },
    });

    return board;
  }

  async findAll(): Promise<Board[]> {
    return this.prisma.board.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        columns: true,
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID: '${id}' not found.`);
    }

    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const { name } = updateBoardDto;

    if (await this.boardNameAlreadyExists(name)) {
      throw new ConflictException(`Board with name '${name}' already exists.`);
    }

    const board = await this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
    });

    return board;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.board.delete({ where: { id } });
  }

  async findBoardColumns(id: number): Promise<Column[]> {
    try {
      const columns = await this.prisma.column.findMany({
        where: { boardId: id },
      });

      return columns;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Foreign key constraint
        if (error.code === 'P2003') {
          throw new NotFoundException(`Board with ID: ${id} does not exist.`);
        }
      }
    }
  }

  /* ---------------------------- Private methods --------------------------- */

  private async boardNameAlreadyExists(name: string): Promise<boolean> {
    const board = await this.prisma.board.findFirst({ where: { name } });

    return Boolean(board);
  }

  private getUniqueColumnNames(columns: CreateColumnDto[]): { name: string }[] {
    const filteredColumns: { name: string }[] = []; // Remove duplicates

    Object.values(columns).forEach((column) => {
      if (!filteredColumns.find((c) => c.name === column.name)) {
        filteredColumns.push(column);
      }
    });

    return filteredColumns;
  }
}
