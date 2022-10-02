import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SeedModule } from 'src/seed/seed.module';
import { BoardsModule } from '../boards/boards.module';
import { PrismaService } from '../prisma/prisma.service';
import { SeedService } from '../seed/seed.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ColumnsModule } from '../columns/columns.module';
import { TasksModule } from '../tasks/tasks.module';
import { SubtasksModule } from '../subtasks/subtasks.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    ConfigService,
    SeedService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
