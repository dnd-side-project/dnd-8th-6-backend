import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberRepository } from '../repository/member.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberResponseDto } from '../presentation/dto/member-response.dto';
import { UpdateMemberRequestDto } from '../presentation/dto/update-member-request.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
  ) {}

  public async getMemberById(id: number): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id);

    return new MemberResponseDto(member);
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
}