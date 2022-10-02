import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Board, Column, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ColumnsService } from '../columns/columns.service';
import { CreateColumnDto } from '../columns/dto/create-column.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    private prisma: PrismaService,
    private columnsService: ColumnsService,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    const { name, columns } = createBoardDto;

    if (await this.boardNameAlreadyExists(name, user)) {
      throw new ConflictException(`Board with name '${name}' already exists.`);
    }

    const filteredColumns = this.getUniqueColumnNames(columns);

    try {
      const board = await this.prisma.board.create({
        data: {
          name,
          userId: user.id,
          columns: {
            createMany: {
              data: filteredColumns.map(({ name }) => ({
                name,
                color: this.columnsService.generateColumnColor(),
                userId: user.id,
              })),
            },
          },
        },
        include: { columns: true },
      });

      return board;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(user: User): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { userId: user.id },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number, user: User): Promise<Board> {
    const board = await this.prisma.board.findFirst({
      where: { id, userId: user.id },
      include: {
        columns: true,
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID: '${id}' not found.`);
    }

    return board;
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
    user: User,
  ): Promise<Board> {
    const { name, columns } = updateBoardDto;

    if (!columns) {
      throw new ConflictException('Columns are required.');
    }

    await this.checkNameOrThrow(id, name, user);

    try {
      const board = await this.prisma.board.update({
        where: { id },
        data: {
          name,
          columns: {
            upsert: columns.map((column) => {
              Logger.debug(column);
              return {
                where: { id: column.id || -1 }, // Using -1 as a placeholder for a non-existent ID
                update: { name: column.name },
                create: {
                  name: column.name,
                  color: this.columnsService.generateColumnColor(),
                  userId: user.id,
                },
              };
            }),
          },
        },
      });

      return board;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.board.delete({ where: { id } });
  }

  async findBoardColumns(id: number, user: User): Promise<Column[]> {
    try {
      const columns = await this.prisma.column.findMany({
        where: { boardId: id, userId: user.id },
        orderBy: { id: 'asc' },
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

  private async boardNameAlreadyExists(
    name: string,
    user: User,
    id?: number,
  ): Promise<boolean> {
    const board = await this.prisma.board.findFirst({
      where: { name, userId: user.id },
    });
    return id ? board && board.id !== id : !!board;
  }

  private getUniqueColumnNames(columns: CreateColumnDto[]): { name: string }[] {
    const filteredColumns: { name: string }[] = []; // Remove duplicates

    Object.values(columns)
      .filter((column) => column.name !== '')
      .forEach((column) => {
        if (!filteredColumns.find((c) => c.name === column.name)) {
          filteredColumns.push(column);
        }
      });

    return filteredColumns;
  }

  private async checkNameOrThrow(
    id: number,
    name: string,
    user: User,
  ): Promise<void> {
    const foundBoard = await this.findOne(id, user);
    if (
      !(foundBoard.name === name) &&
      (await this.boardNameAlreadyExists(name, user))
    ) {
      throw new ConflictException(`Board with name '${name}' already exists.`);
    }
  }
}
