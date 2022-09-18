import { forwardRef, Module } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';

@Module({
  imports: [forwardRef(() => TasksModule), forwardRef(() => ColumnsModule)],
  controllers: [SubtasksController],
  providers: [SubtasksService, TasksService],
  exports: [SubtasksService],
})
export class SubtasksModule {}
