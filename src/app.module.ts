import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchemaValidation } from '../config.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configSchemaValidation,
    }),
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
