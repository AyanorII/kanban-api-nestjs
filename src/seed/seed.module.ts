import { Module } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';
import { ColumnsModule } from '../columns/columns.module';
import { SubtasksModule } from '../subtasks/subtasks.module';
import { TasksModule } from '../tasks/tasks.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [BoardsModule, ColumnsModule, TasksModule, SubtasksModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
