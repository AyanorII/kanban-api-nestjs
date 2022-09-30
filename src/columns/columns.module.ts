import { Module } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { SubtasksService } from '../subtasks/subtasks.service';

@Module({
  imports: [BoardsModule],
  controllers: [ColumnsController],
  providers: [ColumnsService, TasksService, SubtasksService, PrismaService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
