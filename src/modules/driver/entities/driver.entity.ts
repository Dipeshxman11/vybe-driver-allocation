import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { DriverStatus } from '../../../common/enums/driver-status.enum';
import { OneToMany } from 'typeorm';
import { Ride } from '../../ride/entities/ride.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column('decimal', {
    precision: 10,
    scale: 7,
  })
  latitude: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
  })
  longitude: number;

  @OneToMany(
    () => Ride,
    (ride) => ride.driver,
  )
  rides: Ride[];

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  status: DriverStatus;

  @Column({
    default: true,
  })
  isOnline: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}