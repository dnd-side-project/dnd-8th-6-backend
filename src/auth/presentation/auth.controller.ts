import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SocialType } from '../../member/domain/social-type.enum';
import { TokenResponseDto } from './dto/token-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetMember } from './get-member.decorator';
import { Member } from '../../member/domain/member.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao/login')
  async kakaoLogin(@Query('code') code: string): Promise<TokenResponseDto> {
    return await this.authService.login(SocialType.KAKAO, code);
  }

  @Get('/github/login')
  async githubLogin(@Query('code') code: string): Promise<TokenResponseDto> {
    return await this.authService.login(SocialType.GITHUB, code);
  }

  @Post('/reissue')
  async reissueByRefreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<TokenResponseDto> {
    return await this.authService.reissue(refreshToken);
  }

  @UseGuards(AuthGuard())
  @Get('/logout')
  async logout(@GetMember() member: Member): Promise<void> {
    return await this.authService.logout(member);
  }
}
