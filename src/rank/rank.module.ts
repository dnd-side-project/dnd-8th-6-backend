import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLogTypeRepository } from './repository/data-log-type.repository';
import { LogDataRepository } from './repository/log-data.repository';
import { MemberRepository } from '../member/repository/member.repository';
import { Crawler } from '../member/application/crawler';
import { LogDataCronService } from './application/log-data-cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { VelogCollector } from './application/velog.collector';
import { NaverCollector } from './application/naver.collector';
import { HttpModule } from '@nestjs/axios';
import * as xml2js from 'xml2js';
import { RankController } from './presentation/log-data.controller';

@Module({
  controllers: [
    RankController
  ],
  providers: [
    Crawler, 
    LogDataCronService,
    xml2js.Parser,
    VelogCollector,
    NaverCollector
  ],
  imports: [
    TypeOrmModule.forFeature([
      LogDataRepository,
      DataLogTypeRepository,
      MemberRepository,
    ]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
})
export class RankModule {}
