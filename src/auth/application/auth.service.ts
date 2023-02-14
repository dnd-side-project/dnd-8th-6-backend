import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthFactory } from './oauth.factory';
import { SocialType } from '../../member/domain/social-type.enum';
import { MemberRepository } from '../../member/repository/member.repository';
import { SocialInfoDto } from './dto/social-info.dto';
import { Member } from '../../member/domain/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from '../presentation/dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    private readonly oauthFactory: OauthFactory,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(
    socialType: SocialType,
    code: string,
  ): Promise<TokenResponseDto> {
    const oauthClient = this.oauthFactory.getClient(socialType);

    const socialAccessToken = await oauthClient.getAccessToken(code);
    const socialInfo = await oauthClient.getSocialInfo(socialAccessToken);

    let member = await this.memberRepository.findOne({
      socialId: socialInfo.socialId,
      socialType: socialInfo.socialType,
    });
    if (!member) {
      member = await this.signUp(socialInfo);
    }

    return await this.createToken(member);
  }

  public async reissue(refreshToken: string) {
    const expiresIn = parseInt(this.getExpiresIn(refreshToken));
    const now = Math.floor(Date.now() / 1000);

    const member = await this.memberRepository.findOne({
      refreshToken: refreshToken,
    });

    if (expiresIn >= now && member) {
      return await this.createToken(member);
    }

    throw new UnauthorizedException('유효하지 않은 토큰');
  }

  public async signOut(member: Member): Promise<void> {
    member.setRefreshToken(null);
    await this.memberRepository.save(member);
  }

  private async signUp(socialInfo: SocialInfoDto): Promise<Member> {
    const member = await this.memberRepository.create({
      name: socialInfo.name,
      socialId: socialInfo.socialId,
      socialType: socialInfo.socialType,
      profileImageUrl: socialInfo.profileImageUrl,
    });

    return await this.memberRepository.save(member);
  }

  private async createToken(member: Member): Promise<TokenResponseDto> {
    const accessToken = await this.createAccessToken(member);
    const refreshToken = await this.createRefreshToken(member);

    member.setRefreshToken(refreshToken);
    await this.memberRepository.save(member);

    return new TokenResponseDto(
      accessToken,
      this.getExpiresIn(accessToken),
      refreshToken,
      this.getExpiresIn(refreshToken),
    );
  }

  private async createAccessToken(member: Member) {
    const payload = {
      type: 'access_token',
      id: member.id,
      name: member.name,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60,
    });
  }

  private async createRefreshToken(member: Member) {
    const payload = {
      type: 'refresh_token',
      id: member.id,
      name: member.name,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 7,
    });
  }

  private getExpiresIn(token: string): string {
    const decode = this.jwtService.decode(token, {});
    return decode['exp'];
  }
}
