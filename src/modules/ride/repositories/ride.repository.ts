import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Ride } from '../entities/ride.entity';

@Injectable()
export class RideRepository {

    constructor(

        @InjectRepository(Ride)
        private readonly repository: Repository<Ride>,

    ) {}

    create(data: Partial<Ride>) {
        return this.repository.save(data);
    }

    update(ride: Ride) {
        return this.repository.save(ride);
    }

    findById(id: number) {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                driver: true,
            },
        });
    }

}