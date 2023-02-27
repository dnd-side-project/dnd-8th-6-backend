import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataLogTypeRepository } from './repository/commit-log.repository';
import { LogDataRepository } from './repository/log-data.repository';
import { MemberRepository } from '../member/repository/member.repository';
import { Crawler } from '../member/application/crawler';
import { GithubCronService } from './application/github-cron.service';
import { TestController } from './presentation/test.controller';

@Module({
  controllers: [TestController],
  providers: [Crawler, GithubCronService],
  imports: [
    TypeOrmModule.forFeature([
      LogDataRepository,
      DataLogTypeRepository,
      MemberRepository,
    ]),
  ],
})
export class RankModule {}
