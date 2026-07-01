import { Module, forwardRef } from '@nestjs/common';

import { AllocationService } from './allocation.service';
import { DriverModule } from '../driver/driver.module';
import { RideModule } from '../ride/ride.module';
import { NotificationModule } from '../notification/notification.module';
import { WorkersModule } from '../../workers/workers.module';

@Module({
  imports: [
    DriverModule,
    RideModule,
    NotificationModule,
    WorkersModule
  ],
  providers: [AllocationService],
  exports: [AllocationService],
})
export class AllocationModule { }