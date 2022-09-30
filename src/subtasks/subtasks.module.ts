import { forwardRef, Module } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { PrismaService } from '../prisma/prisma.service';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';

@Module({
  imports: [forwardRef(() => TasksModule), forwardRef(() => ColumnsModule)],
  controllers: [SubtasksController],
  providers: [SubtasksService, TasksService, PrismaService],
  exports: [SubtasksService],
})
export class SubtasksModule {}
