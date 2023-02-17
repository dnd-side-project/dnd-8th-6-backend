import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteMemLogRepository } from './repository/delete-member-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeleteMemLogRepository])],
  providers: [],
})
export class DeleteMemLogModule {}
