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
  ): void {
    this.connectedDrivers.set(driverId, socketId);
  }

  removeDriver(driverId: number): void {
    this.connectedDrivers.delete(driverId);
  }

  getSocketId(driverId: number): string | undefined {
    return this.connectedDrivers.get(driverId);
  }

  isDriverConnected(driverId: number): boolean {
    return this.connectedDrivers.has(driverId);
  }

  getConnectedDrivers(): number[] {
    return [...this.connectedDrivers.keys()];
  }
}