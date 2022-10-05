import { Module, forwardRef } from '@nestjs/common';
import { ColumnsService } from '../columns/columns.service';
import { PrismaService } from '../prisma/prisma.service';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [BoardsController],
  providers: [BoardsService, ColumnsService, PrismaService],
  exports: [BoardsService],
})
export class BoardsModule {}
