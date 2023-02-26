import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLogTypeRepository } from './repository/commit-log.repository';
import { LogDataRepository } from './repository/log-data.repository';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TypeOrmModule.forFeature([
      LogDataRepository,
      DataLogTypeRepository
    ])
  ],
})
export class RankModule {}
