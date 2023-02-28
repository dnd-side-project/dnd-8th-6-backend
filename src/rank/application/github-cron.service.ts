import { Injectable, Logger } from '@nestjs/common';
import { MemberRepository } from '../../member/repository/member.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { LogDataRepository } from '../repository/log-data.repository';
import { DataLogTypeRepository } from '../repository/commit-log.repository';
import { Crawler } from '../../member/application/crawler';
import { LogType } from '../domain/log-type.enum';
import { LogData } from '../domain/log-data.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GithubCronService {
  private readonly logger = new Logger(GithubCronService.name);

  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
    @InjectRepository(DataLogTypeRepository)
    private readonly dataLogTypeRepository: DataLogTypeRepository,
    private readonly crawler: Crawler,
  ) {}

  @Cron('0 0 */1 * * *')
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
          // contribution 이 없는 경우는 저장하지 않는다.
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
    this.logger.log(`github crawl complete on: ${new Date().getTime()}`);
  }

  @Cron('0 30 */1 * * *')
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

      if (logs.length === 0) {
        continue;
      }
      const consecutiveDays = this.getConsecutiveDays(logs);

      const logData = await this.logDataRepository.create({
        dataLog: consecutiveDays,
        logDate: logs[0].logDate,
        memberId: String(member.id),
        logTypeId: dataLogType,
      });

      await this.logDataRepository.save(logData);
    }
    this.logger.log(`count consecutive complete on: ${new Date().getTime()}`);
  }

  private getConsecutiveDays(logs: LogData[]) {
    let prevDate = new Date(logs[0].logDate); // 이전 날짜
    let consecutiveDays = 1; // 연속한 날짜 수

    const referenceDate = this.getReferenceDate();

    const diffOfNow = referenceDate.getTime() - prevDate.getTime();
    const diffDayOfNow = diffOfNow / (1000 * 60 * 60 * 24);

    // HEAD 의 날짜가 현 시간을 기준으로 하루 초과했다면 연속 갱신 실패
    if (diffDayOfNow > 1) {
      return 0;
    }
    // 데이터가 1일만 유효하다면 연속 1일
    if (logs.length <= 1) {
      return 1;
    }

    for (let i = 1; i < logs.length; i++) {
      const currentDate = new Date(logs[i].logDate);
      const diffTime = prevDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        consecutiveDays++;
      } else if (diffDays > 1) {
        // 연속하지 않은 날짜를 만나면 함수 종료
        break;
      }
      prevDate = currentDate;
    }
    return consecutiveDays;
  }
  private getReferenceDate() {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();
    return new Date(`${year}-${month}-${day}`);
  }
}
