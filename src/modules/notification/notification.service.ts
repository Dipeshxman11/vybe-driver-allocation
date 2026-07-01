import { Injectable } from '@nestjs/common';

import { Driver } from '../driver/entities/driver.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationService {
    constructor(
        private readonly websocketGateway: WebsocketGateway,
    ) { }

    /**
     * Notify nearby drivers about a new ride.
     */
    async notifyDrivers(
        rideId: number,
        drivers: Driver[],
    ): Promise<void> {
        const driverIds = drivers.map(
            (driver) => driver.id,
        );

        this.websocketGateway.notifyDrivers(
            driverIds,
            'NEW_RIDE',
            {
                rideId,
            },
        );
    }

    /**
     * Notify the driver who won the ride.
     */
    async notifyWinner(
        driverId: number,
        rideId: number,
    ): Promise<void> {
        this.websocketGateway.notifyDriver(
            driverId,
            'RIDE_ASSIGNED',
            {
                rideId,
                message: 'Ride assigned successfully.',
            },
        );
    }

    /**
     * Notify all remaining drivers that the ride has already been assigned.
     */
    async notifyRideClosed(
        winnerDriverId: number,
        rideId: number,
        drivers: Driver[],
    ): Promise<void> {
        const driverIds = drivers.map(
            (driver) => driver.id,
        );

        this.websocketGateway.notifyDriversExcept(
            winnerDriverId,
            driverIds,
            'RIDE_UNAVAILABLE',
            {
                rideId,
                message: 'Ride has already been accepted by another driver.',
            },
        );
    }
}