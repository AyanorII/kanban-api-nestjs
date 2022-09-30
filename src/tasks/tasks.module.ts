import { forwardRef, Module } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SubtasksModule } from 'src/subtasks/subtasks.module';
import { PrismaService } from '../prisma/prisma.service';
import { SubtasksService } from '../subtasks/subtasks.service';

@Module({
  imports: [forwardRef(() => ColumnsModule), forwardRef(() => SubtasksModule)],
  controllers: [TasksController],
  providers: [TasksService, SubtasksService, PrismaService],
  exports: [TasksService],
})
export class TasksModule {}
