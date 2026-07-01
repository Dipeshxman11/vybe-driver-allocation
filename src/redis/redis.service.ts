import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import * as fs from 'fs';
import * as path from 'path';
import { REDIS_KEYS } from './constants/redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: Redis;
    private readonly assignRideLua: string;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
        });

        this.redis.on('connect', () => {
            console.log('✅ Redis Connected');
        });

        this.redis.on('error', (err) => {
            console.error('❌ Redis Error:', err);
        });

        this.assignRideLua = fs.readFileSync(
            path.join(
                process.cwd(),
                'src',
                'modules',
                'allocation',
                'lua',
                'assign-driver.lua',
            ),
            'utf8',
        );
    }

    getClient(): Redis {
        return this.redis;
    }

    /**
     * Add or update driver location
     */
    async addDriverLocation(
        driverId: number,
        latitude: number,
        longitude: number,
    ): Promise<void> {
        await this.redis.geoadd(
            REDIS_KEYS.DRIVER_GEO,
            longitude,
            latitude,
            driverId.toString(),
        );
    }

    /**
     * Remove driver from GEO index
     */
    async removeDriverLocation(driverId: number): Promise<void> {
        await this.redis.zrem(
            REDIS_KEYS.DRIVER_GEO,
            driverId.toString(),
        );
    }

    /**
     * Find nearby drivers
     */
    async findNearbyDrivers(
        latitude: number,
        longitude: number,
        radius = 5,
        limit = 5,
    ): Promise<number[]> {
        const driverIds = await this.redis.geosearch(
            REDIS_KEYS.DRIVER_GEO,
            'FROMLONLAT',
            longitude,
            latitude,
            'BYRADIUS',
            radius,
            'km',
            'ASC',
            'COUNT',
            limit,
        );

        return driverIds.map(Number);
    }

    async onModuleDestroy() {
        await this.redis.quit();
    }

    async tryAssignRide(
        rideId: number,
        driverId: number,
    ): Promise<boolean> {

        const result = await this.redis.eval(
            this.assignRideLua,
            1,
            `ride:${rideId}:lock`,
            driverId.toString(),
        );

        return result === 1;

    }
}