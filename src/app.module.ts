import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchemaValidation } from '../config.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configSchemaValidation,
    }),
    BoardsModule,
    ColumnsModule,
    TasksModule,
    SubtasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
