import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { OauthFactory } from './application/oauth.factory';
import { MemberRepository } from '../member/repository/member.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OauthFactory, MemberRepository],
})
export class AuthModule {}
