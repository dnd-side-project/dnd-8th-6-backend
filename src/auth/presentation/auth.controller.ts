import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SocialType } from '../../member/domain/social-type.enum';
import { TokenResponseDto } from './dto/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao/login')
  async kakaoLogin(@Query('code') code: string): Promise<TokenResponseDto> {
    return await this.authService.signIn(SocialType.KAKAO, code);
  }

  @Get('/github/login')
  async githubLogin(@Query('code') code: string): Promise<TokenResponseDto> {
    return await this.authService.signIn(SocialType.GITHUB, code);
  }
}
