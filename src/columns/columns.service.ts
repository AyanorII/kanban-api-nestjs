import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from '../boards/boards.service';
import { Task } from '../tasks/entities/task.entity';
import { TasksService } from '../tasks/tasks.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  constructor(
    private boardsService: BoardsService,
    @Inject(forwardRef(() => TasksService))
    private tasksService: TasksService,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const { name, boardId } = createColumnDto;

    if (await Column.alreadyExists(name)) {
      throw new BadRequestException(
        `Column with name '${name}' already exists`,
      );
    }
    const column = await new Column();
    const board = await this.boardsService.findOne(boardId);

    column.name = name;
    column.board = board;
    column.color = Column.generateRandomHexColor();
    await column.save();

    return column;
  }

  async findAll(): Promise<Column[]> {
    const columns = await Column.find();

    return columns;
  }

  async findOne(id: number): Promise<Column> {
    const column = await Column.findOne({
      where: { id },
      relations: ['board', 'tasks'],
    });

    if (!column) {
      throw new NotFoundException(`Column with ID: ${id} not found.`);
    }

    return column;
  }

  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    const { name, boardId } = updateColumnDto;
    const board = await this.boardsService.findOne(boardId);

    await Column.update(id, { name, board });
    const column = await this.findOne(id);

    return column;
  }

  async remove(id: number): Promise<void> {
    const column = await this.findOne(id);
    await column.remove();
  }

  async findColumnTasks(columnId: number): Promise<Task[]> {
    return this.tasksService.findColumnTasks(columnId);
  }

  async findBoardColumns(boardId: number): Promise<Column[]> {
    const board = await this.boardsService.findOne(boardId);

    const columns = await Column.createQueryBuilder('column')
      .where({ board })
      .getMany();

    return columns;
  }
}
