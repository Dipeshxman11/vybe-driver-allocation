import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';

import {
    ApiCreatedResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FindNearbyDriverDto } from './dto/find-nearby-driver.dto';

@ApiTags('Drivers')
@Controller('drivers')
export class DriverController {
    constructor(private readonly driverService: DriverService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new driver',
    })
    @ApiCreatedResponse({
        description: 'Driver registered successfully',
    })
    createDriver(
        @Body() dto: CreateDriverDto,
    ) {
        return this.driverService.createDriver(dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all drivers',
    })
    findAllDrivers() {
        return this.driverService.findAllDrivers();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get driver by id',
    })
    @ApiParam({
        name: 'id',
        type: Number,
    })
    findDriverById(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.driverService.findDriverById(id);
    }

    @Patch(':id/location')
    @ApiOperation({
        summary: 'Update driver location',
    })
    updateLocation(
        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdateLocationDto,
    ) {
        return this.driverService.updateLocation(id, dto);
    }

    @Patch(':id/status')
    @ApiOperation({
        summary: 'Update driver status',
    })
    updateStatus(
        @Param('id', ParseIntPipe)
        id: number,

        @Body()
        dto: UpdateDriverStatusDto,
    ) {
        return this.driverService.updateStatus(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Soft delete driver',
    })
    @ApiResponse({
        description: 'Driver deleted successfully',
    })
    deleteDriver(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.driverService.deleteDriver(id);
    }

    @Post('nearby')
    @ApiOperation({
        summary: 'Find nearby available drivers',
    })
    findNearbyDrivers(
        @Body()
        dto: FindNearbyDriverDto,
    ) {
        return this.driverService.findNearbyAvailableDrivers(
            dto.latitude,
            dto.longitude,
        );
    }
}