import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketService {

  /**
   * DriverId -> SocketId
   */
  private readonly connectedDrivers = new Map<number, string>();

  registerDriver(
    driverId: number,
    socketId: string,
  ) {
    this.connectedDrivers.set(driverId, socketId);
  }

  removeDriver(driverId: number) {
    this.connectedDrivers.delete(driverId);
  }

  getSocketId(driverId: number) {
    return this.connectedDrivers.get(driverId);
  }

}