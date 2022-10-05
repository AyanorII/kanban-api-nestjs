import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Column, Task, User } from '@prisma/client';
import { GetUser } from 'src/get-user.decorator';
import { TasksService } from 'src/tasks/tasks.service';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@ApiTags('Columns')
@Controller('columns')
@UseGuards(AuthGuard('jwt'))
export class ColumnsController {
  constructor(
    private columnsService: ColumnsService,
    private tasksService: TasksService,
  ) {}

  @Post()
  async create(
    @Body() createColumnDto: CreateColumnDto,
    @GetUser() user: User,
  ): Promise<Column> {
    const column = await this.columnsService.create(createColumnDto, user);
    return column;
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<Column[]> {
    const columns = await this.columnsService.findAll(user);

    return columns;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Column> {
    return this.columnsService.findOne(id, user);
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
  async findColumnTasks(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.findColumnTasks(id, user);
  }
}
