import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SeedModule } from 'src/seed/seed.module';
import { BoardsModule } from '../boards/boards.module';
import { ColumnsModule } from '../columns/columns.module';
import { PrismaService } from '../prisma/prisma.service';
import { SeedService } from '../seed/seed.service';
import { SubtasksModule } from '../subtasks/subtasks.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: ['jwt', 'google'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    SeedModule,
    forwardRef(() => BoardsModule),
    forwardRef(() => ColumnsModule),
    forwardRef(() => TasksModule),
    forwardRef(() => SubtasksModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    GoogleStrategy,
    ConfigService,
    SeedService,
  ],
  exports: [JwtStrategy, PassportModule, GoogleStrategy],
})
export class AuthModule {}
