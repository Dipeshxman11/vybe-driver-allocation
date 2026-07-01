import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get('DB_HOST'),

        port: Number(config.get('DB_PORT')),

        username: config.get('DB_USERNAME'),

        password: config.get('DB_PASSWORD'),

        database: config.get('DB_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}