import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberRepository } from '../repository/member.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberResponseDto } from '../presentation/dto/member-response.dto';
import { UpdateMemberRequestDto } from '../presentation/dto/update-member-request.dto';
import { GithubClient } from './github.client';
import { GithubContribution } from './dto/github-contribution-response.dto';
import { Crawler } from './crawler';
import { Member } from '../domain/member.entity';
import { StarRepository } from '../../star/repository/star.repository';
import { Star } from '../../star/domain/star.entity';
import { MemberGithubResponseDto } from '../presentation/dto/member-github-response.dto';
import { LogDataRepository } from '../../rank/repository/log-data.repository';
import { DataLogTypeRepository } from '../../rank/repository/data-log-type.repository';
import { LogType } from '../../rank/domain/log-type.enum';

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

    private readonly githubClient: GithubClient,
    private readonly crawler: Crawler,
  ) {}

  public async getMemberById(
    member: Member,
    id: number,
  ): Promise<MemberResponseDto> {
    const foundMember = await this.memberRepository.findOneOrThrow(id);

    return new MemberResponseDto(foundMember);
  }

  public async getGithubInfoById(id: number): Promise<MemberGithubResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (!member.githubId) {
      throw new BadRequestException('github 계정이 등록되지 않았습니다.');
    }

    const githubInfoResponseDto = await this.githubClient.getGithubInfo(
      member.githubId,
    );

    const contributions = await this.getGithubContributions(id);
    const consecutiveCommits = await this.getConsecutiveCommits(id);

    return new MemberGithubResponseDto(
      githubInfoResponseDto,
      contributions,
      consecutiveCommits,
    );
  }

  private async getGithubContributions(memberId: number) {
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

  public async getMemberList(name: string): Promise<MemberResponseDto[]> {
    if (!name) name = '';

    const members =
      await this.memberRepository.getMemberListByNameOrGithubIdLike(name);

    return members.map((member) => new MemberResponseDto(member));
  }

  async updateMember(
    id: number,
    updateMemberRequestDto: UpdateMemberRequestDto,
  ) {
    const member = await this.memberRepository.findOneOrThrow(id);

    member.name = updateMemberRequestDto.name;
    member.githubId = updateMemberRequestDto.githubId;

    await this.memberRepository.save(member);

    return new MemberResponseDto(member);
  }

  async deleteMember(id: number, refreshToken: string): Promise<void> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (member.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    await this.memberRepository.delete(member);
  }

  async getGithubContributionById(id: number): Promise<GithubContribution[]> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (!member.githubId) {
      throw new BadRequestException('github 계정이 등록되지 않았습니다.');
    }

    await this.crawler.setConfig();
    await this.crawler.accessSite(member.githubId);
    await this.crawler.collecteContributionTag();
    const githubContribution = await this.crawler.parseContributionTag();

    await this.crawler.closeBrowser();

    return githubContribution;
  }
}
