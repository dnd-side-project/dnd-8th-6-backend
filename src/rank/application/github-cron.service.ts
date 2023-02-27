import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../member/repository/member.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { LogDataRepository } from '../repository/log-data.repository';
import { DataLogTypeRepository } from '../repository/commit-log.repository';
import { Crawler } from '../../member/application/crawler';
import { LogType } from '../domain/log-type.enum';

@Injectable()
export class GithubCronService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
    @InjectRepository(DataLogTypeRepository)
    private readonly dataLogTypeRepository: DataLogTypeRepository,
    private readonly crawler: Crawler,
  ) {}

  public async crawlGithubAndSaveOnRepository() {
    const dataLogType = await this.dataLogTypeRepository.findOneOrFail({
      where: {
        logType: LogType.COMMIT,
      },
    });
    const members = await this.memberRepository.find();

    for (const member of members) {
      if (!member.githubId) {
        continue;
      }

      await this.crawler.setConfig();
      await this.crawler.accessSite(member.githubId);
      await this.crawler.collecteContributionTag();
      const githubContributions = await this.crawler.parseContributionTag();
      await this.crawler.closeBrowser();

      const legacyLogs = await this.logDataRepository
        .createQueryBuilder('data')
        .where('data.member_id = :id', { id: member.id })
        .andWhere('data.log_type_id = :typeId', { typeId: dataLogType.id })
        .getMany();

      for (const log of legacyLogs) {
        await this.logDataRepository.delete(log);
      }

      for (const contribution of githubContributions) {
        if (!contribution.contribution) {
          contribution.contribution = '0';
        }

        const logData = await this.logDataRepository.create({
          dataLog: Number.parseInt(contribution.contribution),
          logDate: contribution.date,
          memberId: String(member.id),
          logTypeId: dataLogType,
        });

        await this.logDataRepository.save(logData);
      }
    }
  }

  public async countConsecutiveCommits() {
    const dataLogType = await this.dataLogTypeRepository.findOneOrFail({
      where: {
        logType: LogType.COMMITDATE,
      },
    });
    const members = await this.memberRepository.find();

    for (const member of members) {
      if (!member.githubId) {
        continue;
      }

      const legacyLog = await this.logDataRepository
        .createQueryBuilder('data')
        .where('data.member_id = :id', { id: member.id })
        .andWhere('data.log_type_id = :typeId', { typeId: dataLogType.id })
        .getOne();

      if (legacyLog) {
        await this.logDataRepository.delete(legacyLog);
      }

      // blog 데이터 포함하도록 함
      const logs = await this.logDataRepository
        .createQueryBuilder('data')
        .where('data.member_id = :id', { id: member.id })
        .orderBy('data.log_date', 'DESC')
        .groupBy('data.log_date')
        .getMany();

      let consecutiveCount = 0;
      for (const log of logs) {
        if (log.dataLog !== 0) {
          console.log(log);
          consecutiveCount++;
        } else {
          break;
        }
      }

      const logData = await this.logDataRepository.create({
        dataLog: consecutiveCount,
        logDate: logs[0].logDate,
        memberId: String(member.id),
        logTypeId: dataLogType,
      });

      await this.logDataRepository.save(logData);
    }
  }
}
