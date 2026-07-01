import { Injectable } from '@nestjs/common';

import { Driver } from '../driver/entities/driver.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationService {

  constructor(
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async notifyDrivers(
    rideId: number,
    drivers: Driver[],
  ) {

    for (const driver of drivers) {

      this.websocketGateway.notifyDriver(
        driver.id,
        'NEW_RIDE',
        {
          rideId,
        },
      );

    }

  }

}