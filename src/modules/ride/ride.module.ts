import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ride } from './entities/ride.entity';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { RideRepository } from './repositories/ride.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ride])],
  controllers: [RideController],
  providers: [RideService, RideRepository],
  exports: [RideService],
})
export class RideModule {}