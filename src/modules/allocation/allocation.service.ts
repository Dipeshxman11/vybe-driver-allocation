import {
    Injectable,
    Logger,
} from '@nestjs/common';

import { DriverService } from '../driver/driver.service';
import { RideRepository } from '../ride/repositories/ride.repository';
import { RideStatus } from '../../common/enums/ride-status.enum';
import { NotificationService } from '../notification/notification.service';
import { RedisService } from '../../redis/redis.service';
import { RideService } from '../ride/ride.service';
import { RideTimeoutService } from '../../workers/ride-timeout.service';

@Injectable()
export class AllocationService {

    private readonly logger =
        new Logger(AllocationService.name);

    private readonly maxRetries = 3;

    private readonly retryMap =
        new Map<number, number>();

    constructor(

        private readonly driverService: DriverService,

        private readonly rideRepository: RideRepository,

        private readonly notificationService: NotificationService,

        private readonly redisService: RedisService,

        private readonly rideService: RideService,

        private readonly rideTimeoutService: RideTimeoutService,


    ) { }

    async allocateRide(
        rideId: number,
        latitude: number,
        longitude: number,
    ) {

        const ride =
            await this.rideRepository.findById(rideId);

        ride.status = RideStatus.SEARCHING;

        await this.rideRepository.update(ride);

        const nearbyDrivers =
            await this.driverService.findNearbyAvailableDrivers(
                latitude,
                longitude,
            );

        if (!nearbyDrivers.length) {

            ride.status = RideStatus.TIMEOUT;

            await this.rideRepository.update(ride);

            return;

        }

        this.logger.log(
            `Found ${nearbyDrivers.length} nearby drivers`,
        );

        await this.notificationService.notifyDrivers(
            ride.id,
            nearbyDrivers,
        );

        this.rideTimeoutService.startTimer(

            ride.id,

            async () => {

                await this.retryAllocation(
                    ride.id,
                );

            },

            30000,

        );

        ride.status = RideStatus.NOTIFIED;

        await this.rideRepository.update(ride);

    }

    async acceptRide(
        rideId: number,
        driverId: number,
    ) {
        const lockAcquired = await this.redisService.tryAssignRide(
            rideId,
            driverId,
        );

        if (!lockAcquired) {
            return {
                success: false,
                message: 'Ride already assigned',
            };
        }

        this.rideTimeoutService.stopTimer(rideId);

        const ride = await this.rideService.findRideById(rideId);

        const driver = await this.driverService.findDriverById(driverId);

        await this.rideService.assignDriver(rideId, driver);

        await this.driverService.markDriverBusy(driverId);

        await this.notificationService.notifyWinner(
            driverId,
            rideId,
        );


        const nearbyDrivers =
            await this.driverService.findNearbyAvailableDrivers(
                Number(ride.pickupLatitude),
                Number(ride.pickupLongitude),
            );

        await this.notificationService.notifyRideClosed(
            driverId,
            rideId,
            nearbyDrivers,
        );

        return {
            success: true,
            message: 'Ride assigned successfully',
        };
    }

    private async retryAllocation(
        rideId: number,
    ) {
        const ride =
            await this.rideService.findRideById(
                rideId,
            );
        const retries =
            this.retryMap.get(rideId) ?? 0;

        if (retries >= this.maxRetries) {

            await this.rideService.updateRideStatus(
                rideId,
                RideStatus.TIMEOUT,
            );

            return;

        }
        this.retryMap.set(
            rideId,
            retries + 1,
        ); this.logger.log(

            `Retrying allocation for ride ${rideId}`,

        );
        const nearbyDrivers =
            await this.driverService.findNearbyAvailableDrivers(

                Number(
                    ride.pickupLatitude,
                ),

                Number(
                    ride.pickupLongitude,
                ),

            );

        await this.notificationService.notifyDrivers(

            ride.id,

            nearbyDrivers,

        );

        this.rideTimeoutService.startTimer(

            ride.id,

            async () => {

                await this.retryAllocation(
                    ride.id,
                );

            },

        );

    }
}