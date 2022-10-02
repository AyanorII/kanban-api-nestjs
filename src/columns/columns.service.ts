import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { TasksService } from '../tasks/tasks.service';
import { Column, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(createColumnDto: CreateColumnDto, user: User): Promise<Column> {
    const { name, boardId } = createColumnDto;

    if (await this.columnAlreadyExists(name, boardId)) {
      throw new ConflictException(`Column with name '${name}' already exists.`);
    }

    try {
      const column = await this.prisma.column.create({
        data: {
          name,
          boardId,
          color: this.generateColumnColor(),
          userId: user.id,
        },
      });

      return column;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Foreign key constraint
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Board with ID: ${boardId} does not exist.`,
          );
        }
      }
    }
  }

  async findAll(user: User): Promise<Column[]> {
    const { id } = user;
    return this.prisma.column.findMany({
      where: { userId: id },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number, user: User): Promise<Column> {
    const column = await this.prisma.column.findFirst({
      where: { id, userId: user.id },
      include: {
        tasks: true,
        board: true,
      },
    });

    if (!column) {
      throw new NotFoundException(`Column with ID: '${id}' not found.`);
    }

    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const { name, boardId } = updateColumnDto;

    if (await this.columnAlreadyExists(name, boardId)) {
      throw new ConflictException(`Column with name '${name}' already exists`);
    }

    try {
      const column = await this.prisma.column.update({
        where: { id },
        data: updateColumnDto,
      });

      return column;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Board with ID: ${boardId} does not exist.`,
          );
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.column.delete({ where: { id } });
  }

  generateColumnColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
  /* ---------------------------- Private methods --------------------------- */

  private async columnAlreadyExists(
    name: string,
    boardId: number,
  ): Promise<boolean> {
    const found = await this.prisma.column.findFirst({
      where: { boardId, name },
    });

    return Boolean(found);
  }
}
