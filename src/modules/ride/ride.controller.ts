import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RideService } from './ride.service';
import { RequestRideDto } from './dto/request-ride.dto';

@ApiTags('Rides')
@Controller('rides')
export class RideController {
  constructor(
    private readonly rideService: RideService,
  ) {}

  @Post('request')
  @ApiOperation({
    summary: 'Request a new ride',
  })
  async requestRide(
    @Body() requestRideDto: RequestRideDto,
  ) {
    return this.rideService.createRide(requestRideDto);
  }
}