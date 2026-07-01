import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RideTimeoutService {

    private readonly logger =
        new Logger(RideTimeoutService.name);

    private readonly activeTimers =
        new Map<number, NodeJS.Timeout>();

    startTimer(
        rideId:number,
        callback:()=>Promise<void>,
        timeout=30000,
    ){

        this.stopTimer(rideId);

        const timer=setTimeout(async()=>{

            this.logger.log(
                `Ride ${rideId} timed out`,
            );

            await callback();

            this.activeTimers.delete(
                rideId,
            );

        },timeout);

        this.activeTimers.set(
            rideId,
            timer,
        );

    }

    stopTimer(
        rideId:number,
    ){

        const timer=this.activeTimers.get(
            rideId,
        );

        if(timer){

            clearTimeout(timer);

            this.activeTimers.delete(
                rideId,
            );

        }

    }

}