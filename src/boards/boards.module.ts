import { Module } from '@nestjs/common';
import { ColumnsService } from '../columns/columns.service';
import { PrismaService } from '../prisma/prisma.service';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, ColumnsService, PrismaService],
  exports: [BoardsService],
})
export class BoardsModule {}
