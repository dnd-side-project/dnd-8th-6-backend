import { BadRequestException, Injectable } from '@nestjs/common';
import { MemberRepository } from '../repository/member.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMemberRequestDto } from '../presentation/dto/update-member-request.dto';
import { GithubClient } from './github.client';
import { GithubContribution } from './dto/github-contribution-response.dto';
import { Crawler } from './crawler';
import { StarRepository } from '../../star/repository/star.repository';
import { MemberGithubResponseDto } from '../presentation/dto/member-github-response.dto';
import { LogDataRepository } from '../../rank/repository/log-data.repository';
import { DataLogTypeRepository } from '../../rank/repository/data-log-type.repository';
import { LogType } from '../../rank/domain/log-type.enum';
import { MemberGrade } from '../domain/member-grade.enum';
import { LogData } from '../../rank/domain/log-data.entity';
import { GradeDto } from './dto/grade.dto';
import { MemberSummaryResponseDto } from '../presentation/dto/member-summary-response.dto';
import { BlogService } from './blog.service';
import { ProfileService } from './profile.service';
import { StarService } from '../../star/application/star.service';
import { StarSummaryResponseDto } from '../presentation/dto/star-summary-response.dto';
import { StarResponseDto } from '../../star/presentation/dto/star-response.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    @InjectRepository(StarRepository)
    private readonly starRepository: StarRepository,
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
    @InjectRepository(DataLogTypeRepository)
    private readonly dataLogTypeRepository: DataLogTypeRepository,
    private readonly blogService: BlogService,
    private readonly profileService: ProfileService,
    private readonly starService: StarService,
    private readonly githubClient: GithubClient,
    private readonly crawler: Crawler,
  ) {}

  private async getStarSummary(star: StarResponseDto) {
    const followSummary = [];
    for (const followId of star.follow) {
      const member = await this.memberRepository.findOneOrThrow(followId);
      const grade = await this.getGrade(followId);

      followSummary.push(new MemberSummaryResponseDto(member, grade));
    }

    const followerSummary = [];
    for (const followerId of star.follower) {
      const member = await this.memberRepository.findOneOrThrow(followerId);
      const grade = await this.getGrade(followerId);

      followerSummary.push(new MemberSummaryResponseDto(member, grade));
    }

    return new StarSummaryResponseDto(followSummary, followerSummary);
  }

  public async getMemberSummary(id: number): Promise<MemberSummaryResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id);

    const grade = await this.getGrade(id);

    const githubStat = await this.getGithubInfoById(id);

    const contributions = await this.getGithubContributionsInRepository(id);

    const blogStat = await this.blogService.getBlogInfo(id);

    const star = await this.starService.getStarList(id);
    const starSummary = await this.getStarSummary(star);

    const profile = await this.profileService.getProfile(id);

    return new MemberSummaryResponseDto(
      member,
      grade,
      githubStat,
      contributions,
      blogStat,
      starSummary,
      profile,
    );
  }

  private async getGrade(id: number): Promise<GradeDto> {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    const fromDate = `${year}-${month}-01`;
    const toDate =
      month === 12 ? `${year + 1}-01-01` : `${year}-${month + 1}-01`;

    const commitScore = await this.getCommitScore(id, fromDate, toDate);
    const consecutiveScore = await this.getConsecutiveScore(
      id,
      fromDate,
      toDate,
    );
    const blogScore = await this.getBlogScore(id, fromDate, toDate);

    const totalScore = Math.round(commitScore + consecutiveScore + blogScore);

    if (totalScore >= 60) {
      return new GradeDto(MemberGrade.MASTER, 100, totalScore);
    }
    if (totalScore >= 40) {
      const exp = Math.round(((totalScore - 40) / 20) * 100);
      return new GradeDto(MemberGrade.DIAMOND, exp, totalScore);
    }
    if (totalScore >= 20) {
      const exp = Math.round(((totalScore - 20) / 20) * 100);
      return new GradeDto(MemberGrade.PLATINUM, exp, totalScore);
    }
    const exp = Math.round((totalScore / 20) * 100);
    return new GradeDto(MemberGrade.GOLD, exp, totalScore);
  }

  /**
   * ?????? ?????? ?????????, ????????? ???????????? commitScore ??? ????????????.
   * ????????? ?????? ??? commits * 1.2 ?????? ????????????.
   * @param memberId
   * @param fromDate format(%Y-%m)
   * @param toDate format(%Y-%m)
   * @private
   */
  private async getCommitScore(
    memberId: number,
    fromDate: string,
    toDate: string,
  ) {
    const dataLogType = await this.dataLogTypeRepository.findOneLogType(
      LogType.COMMIT.toString(),
    );

    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('COUNT(*)', 'commits')
      .where('data.member_id = :memberId', { memberId: memberId })
      .andWhere('data.log_type_id = :typeId', { typeId: dataLogType.id })
      .andWhere('data.log_date >= :fromDate', {
        fromDate: fromDate,
      })
      .andWhere('data.log_date < :toDate', {
        toDate: toDate,
      })
      .getRawOne<{ commits: number }>();

    return result.commits * 1.2;
  }

  /**
   * ?????? ?????? ?????????, ????????? ???????????? consecutiveScore ??? ????????????.
   * ????????? ?????? ?????? ?????? consecutiveCommits * 1.3 ?????? ????????????.
   * @param memberId
   * @param fromDate format(%Y-%m)
   * @param toDate format(%Y-%m)
   * @private
   */
  private async getConsecutiveScore(
    memberId: number,
    fromDate: string,
    toDate: string,
  ) {
    const dataLogType = await this.dataLogTypeRepository.findOneLogType(
      LogType.COMMIT.toString(),
    );

    const logs = await this.logDataRepository
      .createQueryBuilder('data')
      .where('data.member_id = :memberId', { memberId: memberId })
      .andWhere('data.log_type_id = :typeId', { typeId: dataLogType.id })
      .andWhere('data.log_date >= :fromDate', {
        fromDate: fromDate,
      })
      .andWhere('data.log_date < :toDate', {
        toDate: toDate,
      })
      .orderBy('data.log_date', 'DESC')
      .getMany();

    const consecutiveDays = this.getConsecutiveDays(logs);

    return consecutiveDays * 1.3;
  }

  /**
   * ???????????? logs ??? ?????? ?????? ?????? ????????? ????????????.
   * @param logs
   * @private
   */
  private getConsecutiveDays(logs: LogData[]) {
    if (logs.length === 0) {
      return 0;
    }

    let prevDate = new Date(logs[0].logDate); // ?????? ??????
    let consecutiveDays = 1; // ????????? ?????? ???
    let maxConsecutiveDays = 1;

    // ???????????? 1?????? ??????????????? ?????? 1???
    for (let i = 1; i < logs.length; i++) {
      const currentDate = new Date(logs[i].logDate);
      const diffTime = prevDate.valueOf() - currentDate.valueOf();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        consecutiveDays++;
      } else if (diffDays > 1) {
        maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
        consecutiveDays = 1;
      }
      prevDate = currentDate;
    }
    return Math.max(maxConsecutiveDays, consecutiveDays);
  }

  /**
   * ?????? ?????? ?????????, ????????? ???????????? blogScore ??? ????????????.
   * ????????? ?????? ?????? articles * 2 ?????? ????????????.
   * @param memberId
   * @param fromDate format(%Y-%m)
   * @param toDate format(%Y-%m)
   * @private
   */
  private async getBlogScore(
    memberId: number,
    fromDate: string,
    toDate: string,
  ) {
    const dataLogType = await this.dataLogTypeRepository.findOneLogType(
      LogType.ARTICLECNT.toString(),
    );

    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('SUM(data_log)', 'articles')
      .where('data.member_id = :memberId', { memberId: memberId })
      .andWhere('data.log_type_id = :typeId', { typeId: dataLogType.id })
      .andWhere('data.log_date >= :fromDate', {
        fromDate: fromDate,
      })
      .andWhere('data.log_date < :toDate', {
        toDate: toDate,
      })
      .getRawOne<{ articles: number }>();

    return result.articles * 2;
  }

  public async getGithubInfoById(id: number): Promise<MemberGithubResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (!member.githubId) {
      throw new BadRequestException('github ????????? ???????????? ???????????????.');
    }

    const githubInfoResponseDto = await this.githubClient.getGithubInfo(
      member.githubId,
    );

    const contributions = await this.getTotalContributions(id);
    const consecutiveCommits = await this.getConsecutiveCommits(id);

    return new MemberGithubResponseDto(
      githubInfoResponseDto,
      contributions,
      consecutiveCommits,
    );
  }

  private async getTotalContributions(memberId: number) {
    const logType = await this.dataLogTypeRepository.findOneLogType(
      LogType.COMMIT.toString(),
    );

    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('SUM(data_log)', 'contributions')
      .where('data.member_id = :memberId', { memberId: memberId })
      .andWhere('data.log_type_id = :logTypeId', { logTypeId: logType.id })
      .getRawOne<{ contributions: number }>();

    return result.contributions !== null ? result.contributions : 0;
  }

  private async getConsecutiveCommits(memberId: number) {
    const logType = await this.dataLogTypeRepository.findOneLogType(
      LogType.COMMITDATE.toString(),
    );

    const consecutiveLogData = await this.logDataRepository.findOne({
      where: {
        logTypeId: logType.id,
        memberId: memberId,
      },
    });

    return consecutiveLogData !== null ? consecutiveLogData.dataLog : 0;
  }

  public async getMemberList(
    name: string,
    size: number,
    page: number,
  ): Promise<MemberSummaryResponseDto[]> {
    const members =
      await this.memberRepository.getMemberListByNameOrGithubIdLike(
        name,
        size,
        page,
      );

    const summaries = [];

    for (const member of members) {
      const grade = await this.getGrade(member.id);
      const summary = new MemberSummaryResponseDto(member, grade);
      summaries.push(summary);
    }

    return summaries;
  }

  public async updateMember(
    id: number,
    updateMemberRequestDto: UpdateMemberRequestDto,
  ) {
    const member = await this.memberRepository.findOneOrThrow(id);

    member.name = updateMemberRequestDto.name;
    member.githubId = updateMemberRequestDto.githubId;

    await this.memberRepository.save(member);

    const grade = await this.getGrade(id);

    return new MemberSummaryResponseDto(member, grade);
  }

  public async deleteMember(id: number, refreshToken: string): Promise<void> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (member.refreshToken !== refreshToken) {
      throw new BadRequestException('???????????? ?????? parameter ?????????.');
    }

    await this.memberRepository.delete(member);
  }

  public async getGithubContributionById(
    id: number,
  ): Promise<GithubContribution[]> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (!member.githubId) {
      throw new BadRequestException('github ????????? ???????????? ???????????????.');
    }

    await this.crawler.setConfig();
    await this.crawler.accessSite(member.githubId);
    await this.crawler.collecteContributionTag();
    const githubContribution = await this.crawler.parseContributionTag();

    await this.crawler.closeBrowser();

    return githubContribution;
  }

  public async getGithubContributionsInRepository(
    id: number,
  ): Promise<GithubContribution[]> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (!member.githubId) {
      throw new BadRequestException('github ????????? ???????????? ???????????????.');
    }

    const type = await this.dataLogTypeRepository.findOneLogType(
      LogType.COMMIT.toString(),
    );

    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('SUM(data.data_log)', 'contribution')
      .addSelect('DATE_FORMAT(data.log_date, "%Y-%m")', 'date')
      .where('data.member_id = :memberId', { memberId: id })
      .andWhere('data.log_type_id = :logTypeId', { logTypeId: type.id })
      .andWhere(
        'data.log_date  > DATE_FORMAT(NOW() - INTERVAL 1 YEAR + INTERVAL 1 MONTH, "%Y-%m-01")',
      )
      .groupBy('date')
      .getRawMany<{ contribution: string; date: string }>();

    console.log(result);

    return result.map(
      (log) => new GithubContribution(log.date, log.contribution),
    );
  }
}
