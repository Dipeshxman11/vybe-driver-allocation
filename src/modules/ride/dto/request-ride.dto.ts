import { ApiProperty } from '@nestjs/swagger';

import {
    IsLatitude,
    IsLongitude,
} from 'class-validator';

export class RequestRideDto {

    @ApiProperty()

    @IsLatitude()
    pickupLatitude:number;

    @ApiProperty()

    @IsLongitude()
    pickupLongitude:number;

}