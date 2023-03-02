import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repository/profile.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileRequestDto } from '../presentation/dto/update-profile-request.dto';
import { MemberRepository } from '../repository/member.repository';
import { ProfileResponseDto } from '../presentation/dto/profile-response.dto';
import { Profile } from '../domain/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
  ) {}

  public async getProfile(memberId: number) {
    const member = await this.memberRepository.findOneOrThrow(memberId, {
      relations: ['profile'],
    });

    const profile = await this.getDefaultProfileIfNotExist(member);

    return new ProfileResponseDto(profile);
  }

  public async updateProfile(
    memberId: number,
    createProfileRequestDto: UpdateProfileRequestDto,
  ) {
    const member = await this.memberRepository.findOneOrThrow(memberId, {
      relations: ['profile'],
    });

    const profile = await this.getDefaultProfileIfNotExist(member);

    profile.description = createProfileRequestDto.description;
    await this.profileRepository.save(profile);

    return new ProfileResponseDto(profile);
  }

  private async getDefaultProfileIfNotExist(member): Promise<Profile> {
    if (!member.profile) {
      const profile = await this.profileRepository.create({
        description: '',
        member: member,
      });
      member.profile = await this.profileRepository.save(profile);
    }
    return member.profile;
  }
}
