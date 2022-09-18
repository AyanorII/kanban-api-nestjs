import { Module, forwardRef } from '@nestjs/common';
import { ColumnsModule } from '../columns/columns.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [forwardRef(() => ColumnsModule)],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
