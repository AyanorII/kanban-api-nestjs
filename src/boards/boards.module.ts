import { Module, forwardRef } from '@nestjs/common';
// import { ColumnsModule } from '../columns/columns.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  // imports: [forwardRef(() => ColumnsModule)],
  controllers: [BoardsController],
  providers: [BoardsService, PrismaService],
  exports: [BoardsService],
})
export class BoardsModule {}
