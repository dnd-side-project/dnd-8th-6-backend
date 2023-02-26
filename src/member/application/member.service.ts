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
import { GithubInfoResponseDto } from './dto/github-info-response.dto';
import puppeteer from 'puppeteer';
import { GithubContribution } from './dto/github-contribution-response.dto';
import { Crawler } from './crawler';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    private readonly githubClient: GithubClient,
    private readonly crawler: Crawler,
  ) {}

  public async getMemberById(id: number): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id);

    return new MemberResponseDto(member);
  }

  public async getGithubInfoById(id: number): Promise<GithubInfoResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id);

    if (!member.githubId) {
      throw new BadRequestException('github 계정이 등록되지 않았습니다.');
    }

    return await this.githubClient.getGithubInfo(member.githubId);
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
