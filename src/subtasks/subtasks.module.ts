import { Module } from '@nestjs/common';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';
import { TasksService } from '../tasks/tasks.service';
import { TasksModule } from '../tasks/tasks.module';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  imports: [TasksModule, ColumnsModule],
  controllers: [SubtasksController],
  providers: [SubtasksService, TasksService],
})
export class SubtasksModule {}
