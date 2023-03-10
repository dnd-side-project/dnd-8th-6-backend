import { Injectable, Logger } from '@nestjs/common';
import { MemberRepository } from '../../member/repository/member.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { LogDataRepository } from '../repository/log-data.repository';
import { DataLogTypeRepository } from '../repository/data-log-type.repository';
import { Crawler } from '../../member/application/crawler';
import { LogType } from '../domain/log-type.enum';
import { LogData } from '../domain/log-data.entity';
import { Cron } from '@nestjs/schedule';
import { GithubContribution } from '../../member/application/dto/github-contribution-response.dto';
import { Member } from '../../member/domain/member.entity';
import { VelogCollector } from './velog.collector';
import { NaverCollector } from './naver.collector';
import { LogDataDto } from './dto/log-data.dto';


@Injectable()
export class LogDataCronService {
  private readonly logger = new Logger(LogDataCronService.name);

  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
    @InjectRepository(DataLogTypeRepository)
    private readonly dataLogTypeRepository: DataLogTypeRepository,
    private readonly crawler: Crawler,
    private readonly velogCollector: VelogCollector,
    private readonly naverCollector: NaverCollector,
    
  ) {}

  @Cron('0 10 */2 * * *')
  public async collectVelogLog() {
    const flatform = 'VELOG';
    const member = await this.memberRepository.getMembersWithBlogs(flatform);
    const logType = await this.dataLogTypeRepository.findOneLogType('ARTICLECNT');
    const upDateData = await Promise.all(member.map(async m => {
      this.velogCollector.author = m.blog.blogName;
      await this.velogCollector.getBlogData();
      await this.velogCollector.convertXml2Json();
      this.velogCollector.serialize();
      const res = await Promise.all(this.velogCollector.jsonData.map(async data => {
        const logData = new LogDataDto(data.pubDate, m.id, logType.id, data.articles.length);
        const r = await this.logDataRepository.upsertLogData(logData);
        return r;
      }));
      return res;
    }));

    return upDateData;
  }

  @Cron('0 20 */2 * * *')
  public async collectNaverLog() {
    console.log('batvch');
    const flatform = 'NAVER';
    const member = await this.memberRepository.getMembersWithBlogs(flatform);
    const logType = await this.dataLogTypeRepository.findOneLogType('ARTICLECNT');
    const upDateData = await Promise.all(member.map(async m => {
      this.naverCollector.author = m.blog.blogName;
      await this.naverCollector.getBlogData();
      await this.naverCollector.convertXml2Json();
      this.naverCollector.serialize();
      const res = await Promise.all(this.naverCollector.jsonData.map(async data => {
        const logData = new LogDataDto(data.pubDate, m.id, logType.id, data.articles.length);
        const r = await this.logDataRepository.upsertLogData(logData);
        return r;
      }));
      return res;
    }));

    return upDateData;
  }


  @Cron('0 0 */2 * * *')
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
      const years = await this.getYearsRangeOfGithub(member);

      const contributions = new Set<GithubContribution>();

      for (const year of years) {
        const githubContributions = await this.getContributionsOfYears(
          member,
          year,
        );
        githubContributions.forEach((c) => contributions.add(c));
      }

      await this.crawler.closeBrowser();

      const legacyLogs = await this.logDataRepository
        .createQueryBuilder('data')
        .where('data.member_id = :id', { id: member.id })
        .andWhere('data.log_type_id = :typeId', { typeId: dataLogType.id })
        .getMany();

      for (const log of legacyLogs) {
        await this.logDataRepository.delete(log);
      }

      for (const contribution of contributions) {
        if (!contribution.contribution) {
          // contribution ??? ?????? ????????? ???????????? ?????????.
          continue;
        }

        const logData = await this.logDataRepository.create({
          dataLog: Number.parseInt(contribution.contribution),
          logDate: contribution.date,
          memberId: member.id,
          logType: dataLogType,
        });
        await this.logDataRepository.save(logData);
      }
    }
    this.logger.log(`github crawl complete on: ${new Date().getTime()}`);
  }

  private async getYearsRangeOfGithub(member: Member): Promise<number[]> {
    await this.crawler.accessSite(member.githubId);
    await this.crawler.collectYearTags();
    return await this.crawler.parseYearTag();
  }

  private async getContributionsOfYears(
    member: Member,
    year: number,
  ): Promise<GithubContribution[]> {
    await this.crawler.accessSiteWithYear(member.githubId, year);
    await this.crawler.collecteContributionTag();
    return await this.crawler.parseContributionTag();
  }

  @Cron('0 30 */2 * * *')
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

      // blog ????????? ??????????????? ???
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
        memberId: member.id,
        logType: dataLogType,
      });

      await this.logDataRepository.save(logData);
    }
    this.logger.log(`count consecutive complete on: ${new Date().getTime()}`);
  }

  private getConsecutiveDays(logs: LogData[]) {
    let prevDate = new Date(logs[0].logDate); // ?????? ??????
    let consecutiveDays = 1; // ????????? ?????? ???

    const referenceDate = this.getReferenceDate();

    const diffOfNow = referenceDate.getTime() - prevDate.getTime();
    const diffDayOfNow = diffOfNow / (1000 * 60 * 60 * 24);

    // HEAD ??? ????????? ??? ????????? ???????????? ?????? ??????????????? ?????? ?????? ??????
    if (diffDayOfNow > 1) {
      return 0;
    }
    // ???????????? 1?????? ??????????????? ?????? 1???
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
        // ???????????? ?????? ????????? ????????? ?????? ??????
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
