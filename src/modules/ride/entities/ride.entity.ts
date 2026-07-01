import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { RideStatus } from '../../../common/enums/ride-status.enum';
import {
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
  })
  pickupLatitude: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
  })
  pickupLongitude: number;

  @ManyToOne(() => Driver, {
    nullable: true,
  })
  @JoinColumn({
    name: 'assignedDriverId',
  })
  driver: Driver;

  @Column({
    type: 'enum',
    enum: RideStatus,
    default: RideStatus.REQUESTED,
  })
  status: RideStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}