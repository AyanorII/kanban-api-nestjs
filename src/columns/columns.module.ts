import { forwardRef, Module } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';
// import { TasksModule } from '../tasks/tasks.module';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [forwardRef(() => BoardsModule)],
  // imports: [forwardRef(() => BoardsModule), forwardRef(() => TasksModule)],
  controllers: [ColumnsController],
  providers: [ColumnsService, PrismaService],
  exports: [ColumnsService],
})
export class ColumnsModule {}
