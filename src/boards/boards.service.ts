import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const { name, columns } = createBoardDto;
    const board = await this.prisma.board.create({
      data: { name },
    });

    // const board = new Board();
    // board.name = name;
    // await board.save();

    // if (columns?.length) {
    //   const columnsPromise = columns
    //     .filter((column) => typeof column === 'string')
    //     .map(
    //       this.columnsService.create({ name: column, boardId: board.id }),
    //     );

    //   Promise.all(columnsPromise);
    // }

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
    try {
      const board = await this.prisma.board.update({
        where: { id },
        data: updateBoardDto,
      });

      return board;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Board with ID: '${id}' not found.`);
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.board.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Board with ID: '${id}' not found.`);
        }
      }
    }
  }
}
