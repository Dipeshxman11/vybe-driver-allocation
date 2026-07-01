import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { Driver } from './entities/driver.entity';
import { DriverRepository } from './repositories/driver.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],

  controllers: [DriverController],

  providers: [DriverService, DriverRepository],

  exports: [DriverService],
})
export class DriverModule {}