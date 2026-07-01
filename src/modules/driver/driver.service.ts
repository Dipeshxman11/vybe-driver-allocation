import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { DriverRepository } from './repositories/driver.repository';
import { RedisService } from '../../redis/redis.service';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';

@Injectable()
export class DriverService {
    constructor(
        private readonly driverRepository: DriverRepository,
        private readonly redisService: RedisService,
    ) { }

    async createDriver(dto: CreateDriverDto) {
        const driver = await this.driverRepository.create(dto);

        await this.redisService.addDriverLocation(
            driver.id,
            driver.latitude,
            driver.longitude,
        );

        return driver;
    }

    async findAllDrivers() {
        return this.driverRepository.findAll();
    }

    async findDriverById(id: number) {
        const driver = await this.driverRepository.findById(id);

        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        return driver;
    }

    async updateStatus(
        id: number,
        dto: UpdateDriverStatusDto,
    ) {
        const driver = await this.findDriverById(id);

        driver.status = dto.status;

        return this.driverRepository.update(driver);
    }

    async updateLocation(
        id: number,
        dto: UpdateLocationDto,
    ) {
        const driver = await this.findDriverById(id);

        driver.latitude = dto.latitude;
        driver.longitude = dto.longitude;

        const updatedDriver = await this.driverRepository.update(driver);

        await this.redisService.addDriverLocation(
            updatedDriver.id,
            updatedDriver.latitude,
            updatedDriver.longitude,
        );

        return updatedDriver;
    }

    async deleteDriver(id: number) {
        await this.findDriverById(id);

        await this.driverRepository.softDelete(id);

        await this.redisService.removeDriverLocation(id);

        return {
            message: 'Driver deleted successfully',
        };
    }

    async findNearbyAvailableDrivers(
        latitude: number,
        longitude: number,
    ) {
        const nearbyDriverIds =
            await this.redisService.findNearbyDrivers(
                latitude,
                longitude,
                5,
                5,
            );

        if (!nearbyDriverIds.length) {
            return [];
        }

        return this.driverRepository.findAvailableDriversByIds(
            nearbyDriverIds,
        );
    }
}