import { forwardRef, Module } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [forwardRef(() => ColumnsModule)],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
