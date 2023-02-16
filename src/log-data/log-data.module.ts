import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogDataRepository } from './repository/log-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LogDataRepository])],
  providers: [],
})
export class LogDataModule {}
