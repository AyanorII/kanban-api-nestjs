import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), BoardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
