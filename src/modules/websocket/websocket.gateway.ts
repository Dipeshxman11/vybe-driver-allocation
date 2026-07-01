import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { Logger } from '@nestjs/common';

import { WebsocketService } from './websocket.service';
import { AllocationService } from '../allocation/allocation.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WebsocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger =
        new Logger(WebsocketGateway.name);


    private readonly allocationService: AllocationService;

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly websocketService: WebsocketService,
    ) { }

    handleConnection(client: Socket) {
        this.logger.log(
            `Client Connected : ${client.id}`,
        );
    }

    handleDisconnect(client: Socket) {
        this.logger.log(
            `Client Disconnected : ${client.id}`,
        );
    }

    @SubscribeMessage('register-driver')
    registerDriver(
        @ConnectedSocket()
        client: Socket,

        @MessageBody()
        body: {
            driverId: number;
        },
    ) {
        this.websocketService.registerDriver(
            body.driverId,
            client.id,
        );

        client.emit('registered', {
            message: 'Driver Registered Successfully',
        });
    }

    notifyDriver(
        driverId: number,
        event: string,
        payload: any,
    ) {
        const socketId =
            this.websocketService.getSocketId(driverId);

        if (!socketId) {
            return;
        }

        this.server.to(socketId).emit(
            event,
            payload,
        );
    }

    notifyDrivers(
        driverIds: number[],
        event: string,
        payload: any,
    ): void {
        for (const driverId of driverIds) {
            this.notifyDriver(
                driverId,
                event,
                payload,
            );
        }
    }

    notifyDriversExcept(
        excludedDriverId: number,
        driverIds: number[],
        event: string,
        payload: any,
    ): void {
        for (const driverId of driverIds) {
            if (driverId === excludedDriverId) {
                continue;
            }

            this.notifyDriver(
                driverId,
                event,
                payload,
            );
        }
    }

    @SubscribeMessage('driver-accept-ride')
    async acceptRide(

        @MessageBody()
        body: {
            rideId: number;
            driverId: number;
        }

    ) {

        return this.allocationService.acceptRide(
            body.rideId,
            body.driverId,
        );

    }
}