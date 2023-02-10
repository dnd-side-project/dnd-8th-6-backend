import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { OauthFactory } from './application/oauth.factory';
import { MemberRepository } from '../member/repository/member.repository';
import { KakaoOauthClient } from './application/kakao-oauth.client';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubOauthClient } from './application/github-oauth.client';

@Module({
  controllers: [AuthController],
  providers: [AuthService, OauthFactory, KakaoOauthClient, GithubOauthClient],
  imports: [HttpModule, TypeOrmModule.forFeature([MemberRepository])],
})
export class AuthModule {}
