import { Module } from '@nestjs/common';

import { RideTimeoutService } from './ride-timeout.service';

@Module({
    providers:[
        RideTimeoutService,
    ],
    exports:[
        RideTimeoutService,
    ],
})
export class WorkersModule {}