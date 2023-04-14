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
import { DummyDataGenerator } from './dummy-data-generator';

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

  private async executeWithRetry(
    func: () => Promise<any>,
    maxRetries = 5,
    retryInterval = 1000,
  ) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await func();
      } catch (err) {
        this.logger.error(
          `Error occurred while executing function: ${err}`,
          err.stack,
        );
        retries++;
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
    this.logger.error(`Function execution failed after ${maxRetries} retries`);
    throw new Error('Function execution failed');
  }


  @Cron('0 0 */2 * * *')
  public async collectGithubCommitWithRetry() {
    this.logger.log(`github commit crawl start on: ${new Date().getTime()}`);
    await this.executeWithRetry(this.crawlGithubAndSaveOnRepository.bind(this));
    this.logger.log(`github commit crawl complete on: ${new Date().getTime()}`);
  }

  @Cron('0 10 */2 * * *')
  public async collectVelogLogWithRetry() {
    this.logger.log(`velog crawl start on: ${new Date().getTime()}`);
    await this.executeWithRetry(this.collectVelogLog.bind(this));
    this.logger.log(`velog crawl complete on: ${new Date().getTime()}`);
  }

  @Cron('0 20 */2 * * *')
  public async collectNaverLogWithRetry() {
    this.logger.log(`naver crawl start on: ${new Date().getTime()}`);
    await this.executeWithRetry(this.collectNaverLog.bind(this));
    this.logger.log(`naver crawl complete on: ${new Date().getTime()}`);
  }

  @Cron('0 30 */2 * * *')
  public async collectConsecutiveCommitLogWithRetry() {
    this.logger.log(`github cc crawl start on: ${new Date().getTime()}`);
    await this.executeWithRetry(this.countConsecutiveCommits.bind(this));
    this.logger.log(`github cc crawl complete on: ${new Date().getTime()}`);
  }

  @Cron('0 0 2 * * *') 
  public async collectDummyWithRetry(){
    this.logger.log(`gen dummy start on: ${new Date().getTime()}`);
    await this.executeWithRetry(this.genDummyData.bind(this));
    this.logger.log(`gen dummy complete on: ${new Date().getTime()}`);
  }



  public async collectVelogLog() {
    const flatform = 'VELOG';
    const member = await this.memberRepository.getMembersWithBlogs(flatform);
    const logType = await this.dataLogTypeRepository.findOneLogType(
      LogType.ARTICLECNT,
    );
    const upDateData = await Promise.all(
      member.map(async (m) => {
        this.velogCollector.author = m.blog.blogName;
        await this.velogCollector.getBlogData();
        await this.velogCollector.convertXml2Json();
        this.velogCollector.serialize();
        const res = await Promise.all(
          this.velogCollector.jsonData.map(async (data) => {
            const logData = new LogDataDto(
              data.pubDate,
              m.id,
              logType.id,
              data.articles.length,
            );
            const r = await this.logDataRepository.upsertLogData(logData);
            return r;
          }),
        );
        return res;
      }),
    );

    return upDateData;
  }

  public async collectNaverLog() {
    const flatform = 'NAVER';
    const member = await this.memberRepository.getMembersWithBlogs(flatform);
    const logType = await this.dataLogTypeRepository.findOneLogType(
      LogType.ARTICLECNT,
    );
    const upDateData = await Promise.all(
      member.map(async (m) => {
        this.naverCollector.author = m.blog.blogName;
        await this.naverCollector.getBlogData();
        await this.naverCollector.convertXml2Json();
        this.naverCollector.serialize();
        const res = await Promise.all(
          this.naverCollector.jsonData.map(async (data) => {
            const logData = new LogDataDto(
              data.pubDate,
              m.id,
              logType.id,
              data.articles.length,
            );
            const r = await this.logDataRepository.upsertLogData(logData);
            return r;
          }),
        );
        return res;
      }),
    );

    return upDateData;
  }

  public async crawlGithubAndSaveOnRepository() {
    // 데이터로그타입을 조회 ex 커밋수, 블로그 데이터인지
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

      const contributionData = [];

      for (const year of years) {
        const githubContributions = await this.getContributionsOfYears(
          member,
          year,
        );
        githubContributions.forEach((c) => {
          contributionData.push({
            logDate: new Date(c.date).toISOString().substring(0, 10),
            memberId: member.id,
            logTypeId: dataLogType.id,
            dataLog: c.contribution ? parseInt(c.contribution): 0,
          });
        });
      }

      await this.crawler.closeBrowser();

      await Promise.all(
      contributionData.map(async (logData) => {
        return await this.logDataRepository.upsertLogData(logData);
      }));
  
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

      // blog 데이터 포함하도록 함
      const logs = await this.logDataRepository
        .createQueryBuilder('data')
        .where('data.member_id = :id', { id: member.id })
        .orderBy('data.log_date', 'DESC')
        .groupBy('data.log_date')
        .getMany();

      let consecutiveDays = 0;
      if (logs.length > 0) {
        consecutiveDays = this.getConsecutiveDays(logs);
      }

      await this.logDataRepository.upsertLogData({
        dataLog: consecutiveDays,
        logDate: logs[0].logDate,
        memberId: member.id,
        logTypeId: dataLogType.id,
      });
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

      if (diffDays === 1 && logs[i].dataLog > 0) {
        // 연속적인 날짜 및 유의미한 데이터가 존재할 때 연속 날짜로 취급
        consecutiveDays++;
      } else {
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

  async genDummyData() {
    const member = await this.memberRepository.find();
    const upsert = member.map(async (m) => {
      const dummyDataGenerator = new DummyDataGenerator();
      dummyDataGenerator.dataInit();

      for(const data of dummyDataGenerator.dummy){
        await this.logDataRepository.upsertLogData({
          logDate: data.logDate,
          memberId: m.id,
          logTypeId: 1,
          dataLog: data.commit,
        });
        await this.logDataRepository.upsertLogData({
          logDate: data.logDate,
          memberId: m.id,
          logTypeId: 2,
          dataLog: data.cc,
        });
        await this.logDataRepository.upsertLogData({
          logDate: data.logDate,
          memberId: m.id,
          logTypeId: 3,
          dataLog: data.blog,
        });
      }
    });
    await Promise.all(upsert);
  }
}
