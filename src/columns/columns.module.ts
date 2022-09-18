import { forwardRef, Module } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';
import { TasksModule } from '../tasks/tasks.module';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [forwardRef(() => BoardsModule), forwardRef(() => TasksModule)],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
