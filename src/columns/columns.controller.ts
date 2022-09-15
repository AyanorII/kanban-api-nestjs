import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Board } from '../boards/entities/board.entity';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  async create(@Body() createColumnDto: CreateColumnDto) {
    const { boardId } = createColumnDto;

    try {
      const column = await this.columnsService.create(createColumnDto);
      return column;
    } catch (err) {
      throw new NotFoundException(`Board with ID: ${boardId} not found`);
    }
  }

  @Get()
  async findAll() {
    const columns = await this.columnsService.findAll();

    return columns;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.columnsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    const column = await this.columnsService.update(id, updateColumnDto);

    return column;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(+id);
  }
}
