import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DriverModule } from './modules/driver/driver.module';
import { RideModule } from './modules/ride/ride.module';
import { AllocationModule } from './modules/allocation/allocation.module';
import { NotificationModule } from './modules/notification/notification.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    RedisModule,
    WorkersModule,

    DriverModule,
    RideModule,
    AllocationModule,
    NotificationModule,
    WebsocketModule,
  ],
})
export class AppModule {}