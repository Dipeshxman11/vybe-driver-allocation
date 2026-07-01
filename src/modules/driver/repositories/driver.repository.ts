import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Driver } from '../entities/driver.entity';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectRepository(Driver)
    private readonly repository: Repository<Driver>,
  ) {}

  create(data: Partial<Driver>) {
    return this.repository.save(data);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
    });
  }

  update(driver: Driver) {
    return this.repository.save(driver);
  }

  softDelete(id: number) {
    return this.repository.softDelete(id);
  }
}