import { Module } from '@nestjs/common';
import { AllocationService } from './allocation.service';

@Module({
  providers: [AllocationService]
})
export class AllocationModule {}
