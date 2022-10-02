import { Module } from '@nestjs/common';
import { TasksService } from 'src/tasks/tasks.service';
import { BoardsService } from '../boards/boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubtasksService } from '../subtasks/subtasks.service';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  controllers: [ColumnsController],
  providers: [
    BoardsService,
    ColumnsService,
    TasksService,
    SubtasksService,
    PrismaService,
  ],
  exports: [ColumnsService],
})
export class ColumnsModule {}
