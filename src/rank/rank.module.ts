import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogDataService } from './application/log-data.service';
import { LogDataController } from './presentation/log-data.controller';
import { DataLogTypeRepository } from './repository/commit-log.repository';
import { LogDataRepository } from './repository/log-data.repository';

@Module({
  controllers: [LogDataController],
  providers: [    
    LogDataService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      LogDataRepository,
      DataLogTypeRepository
    ])
  ],
})
export class RankModule {}
