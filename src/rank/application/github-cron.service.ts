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
          continue;
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
}
