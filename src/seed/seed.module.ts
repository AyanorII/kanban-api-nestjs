import { Module, forwardRef } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';
import { BoardsService } from '../boards/boards.service';
import { ColumnsModule } from '../columns/columns.module';
import { ColumnsService } from '../columns/columns.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubtasksModule } from '../subtasks/subtasks.module';
import { SubtasksService } from '../subtasks/subtasks.service';
import { TasksModule } from '../tasks/tasks.module';
import { TasksService } from '../tasks/tasks.service';
import { SeedService } from './seed.service';

@Module({
  imports: [
    forwardRef(() => BoardsModule),
    ColumnsModule,
    TasksModule,
    SubtasksModule,
  ],
  providers: [
    SeedService,
    BoardsService,
    ColumnsService,
    TasksService,
    SubtasksService,
    PrismaService,
  ],
})
export class SeedModule {}
