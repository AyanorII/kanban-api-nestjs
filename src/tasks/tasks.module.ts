import { forwardRef, Module } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SubtasksModule } from '../subtasks/subtasks.module';

@Module({
  imports: [forwardRef(() => ColumnsModule), SubtasksModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
