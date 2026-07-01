import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Driver } from '../entities/driver.entity';
import { DriverStatus } from '../../../common/enums/driver-status.enum';
import { In } from 'typeorm';

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

  async findAvailableDriversByIds(ids: number[]) {
  if (!ids.length) return [];

  return this.repository.find({
    where: {
      id: In(ids),
      status: DriverStatus.AVAILABLE,
      isOnline: true,
    },
  });
}
}