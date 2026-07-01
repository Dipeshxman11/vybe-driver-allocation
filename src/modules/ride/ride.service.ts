import { Injectable } from '@nestjs/common';

import { RideRepository } from './repositories/ride.repository';

import { Ride } from './entities/ride.entity';
import { Driver } from '../driver/entities/driver.entity';

import { RideStatus } from '../../common/enums/ride-status.enum';

@Injectable()
export class RideService {
  constructor(
    private readonly rideRepository: RideRepository,
  ) {}

  /**
   * Create a new ride
   */
  async createRide(data: Partial<Ride>): Promise<Ride> {
    return this.rideRepository.create(data);
  }

  /**
   * Get ride by id
   */
  async findRideById(id: number): Promise<Ride> {
    return this.rideRepository.findById(id);
  }

  /**
   * Save updated ride
   */
  async updateRide(ride: Ride): Promise<Ride> {
    return this.rideRepository.update(ride);
  }

  /**
   * Update ride status
   */
  async updateRideStatus(
    rideId: number,
    status: RideStatus,
  ): Promise<Ride> {
    const ride = await this.findRideById(rideId);

    ride.status = status;

    return this.rideRepository.update(ride);
  }

  /**
   * Assign driver to ride
   */
  async assignDriver(
    rideId: number,
    driver: Driver,
  ): Promise<Ride> {
    const ride = await this.findRideById(rideId);

    ride.driver = driver;
    ride.status = RideStatus.ASSIGNED;

    return this.rideRepository.update(ride);
  }
}