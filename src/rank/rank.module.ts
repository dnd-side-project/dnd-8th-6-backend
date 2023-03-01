import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLogTypeRepository } from './repository/commit-log.repository';
import { LogDataRepository } from './repository/log-data.repository';
import { MemberRepository } from '../member/repository/member.repository';
import { Crawler } from '../member/application/crawler';
import { LogDataCronService } from './application/log-data-cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [],
  providers: [Crawler, LogDataCronService],
  imports: [
    TypeOrmModule.forFeature([
      LogDataRepository,
      DataLogTypeRepository,
      MemberRepository,
    ]),
    ScheduleModule.forRoot(),
  ],
})
export class RankModule {}
