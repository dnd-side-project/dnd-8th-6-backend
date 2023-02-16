import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLogTypeRepository } from './repository/commit-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DataLogTypeRepository])],
  providers: [],
})
export class DataLogTypeModule {}
