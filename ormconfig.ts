import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PGHOST'),
    port: configService.get('PGPORT'),
    username: configService.get('PGUSER'),
    password: configService.get('PGPASSWORD'),
    database: configService.get('PGDATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: true,
    autoLoadEntities: true,
  }),
};
