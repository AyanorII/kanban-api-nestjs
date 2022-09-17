import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';
import { Task } from '../tasks/entities/task.entity';
import { TasksService } from '../tasks/tasks.service';

@Controller('columns')
export class ColumnsController {
  constructor(
    private columnsService: ColumnsService,
    private tasksService: TasksService,
  ) {}

  @Post()
  async create(@Body() createColumnDto: CreateColumnDto): Promise<Column> {
    const { boardId } = createColumnDto;

    try {
      const column = await this.columnsService.create(createColumnDto);
      return column;
    } catch (err) {
      throw new NotFoundException(`Board with ID: ${boardId} not found`);
    }
  }

  @Get()
  async findAll(): Promise<Column[]> {
    const columns = await this.columnsService.findAll();

    return columns;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Column> {
    return this.columnsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ): Promise<Column> {
    const column = await this.columnsService.update(id, updateColumnDto);

    return column;
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.columnsService.remove(id);
  }

  @Get(':id/tasks')
  async findColumnTasks(@Param('id') id: number): Promise<Task[]> {
    return this.tasksService.findColumnTasks(id);
  }
}
