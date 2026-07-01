import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ride } from '../entities/ride.entity';

@Injectable()
export class RideRepository {

    constructor(

        @InjectRepository(Ride)
        private readonly repository: Repository<Ride>,

    ) { }

async create(data: Partial<Ride>): Promise<Ride> {
  return this.repository.save(data);
}

async update(ride: Ride): Promise<Ride> {
  return this.repository.save(ride);
}

    async findById(id: number): Promise<Ride> {
        const ride = await this.repository.findOne({
            where: {
                id,
            },
            relations: {
                driver: true,
            },
        });

        if (!ride) {
            throw new NotFoundException(`Ride with id ${id} not found`);
        }

        return ride;
    }

}