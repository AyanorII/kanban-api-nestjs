import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from '../boards/boards.service';
// import { TasksService } from '../tasks/tasks.service';
import { Column } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    private boardsService: BoardsService,
    private prisma: PrismaService, // @Inject(forwardRef(() => TasksService)) // private tasksService: TasksService,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const { name, boardId } = createColumnDto;

    if (await this.columnAlreadyExists(name, boardId)) {
      throw new BadRequestException(
        `Column with name '${name}' already exists.`,
      );
    }

    try {
      const column = await this.prisma.column.create({
        data: { name, boardId, color: this.generateColumnColor() },
      });

      return column;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Foreign key constraint
        if (error.code === 'P2003') {
          throw new BadRequestException(
            `Board with ID: ${boardId} does not exist.`,
          );
        }
      }
    }
  }

  async findAll(): Promise<Column[]> {
    return this.prisma.column.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number): Promise<Column> {
    const column = await this.prisma.column.findFirst({
      where: { id },
      include: {
        tasks: true,
        board: true,
      },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID: ${id} not found.`);
    }

    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const { name, boardId } = updateColumnDto;

    if (await this.columnAlreadyExists(name, boardId)) {
      throw new BadRequestException(
        `Column with name '${name}' already exists`,
      );
    }

    try {
      const column = await this.prisma.column.update({
        where: { id },
        data: updateColumnDto,
      });

      return column;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Not Found
        if (error.code === 'P2025') {
          throw new NotFoundException(`Column with ID: ${id} not found.`);
        } else if (error.code === 'P2003') {
          // Foreign key constraint failed
          throw new NotFoundException(
            `Board with ID: ${boardId} does not exist.`,
          );
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.column.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Not Found
        if (error.code === 'P2025') {
          throw new NotFoundException(`Column with ID: ${id} not found.`);
        }
      }
    }
  }

  // async findColumnTasks(columnId: number): Promise<Task[]> {
  //   return this.tasksService.findColumnTasks(columnId);
  // }

  // async findBoardColumns(boardId: number): Promise<Column[]> {
  //   const board = await this.boardsService.findOne(boardId);

  //   const columns = await Column.createQueryBuilder('column')
  //     .where({ board })
  //     .getMany();

  //   return columns;
  // }

  /* ---------------------------- Private methods --------------------------- */

  private async columnAlreadyExists(
    name: string,
    boardId: number,
  ): Promise<boolean> {
    try {
      const found = await this.prisma.column.findFirst({
        where: { boardId, name },
      });

      return Boolean(found);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          //The record searched for in the where condition does not exist
          throw new NotFoundException(
            `Board with ID: ${boardId} does not exist.`,
          );
        }
      }
    }
  }

  private generateColumnColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
}
