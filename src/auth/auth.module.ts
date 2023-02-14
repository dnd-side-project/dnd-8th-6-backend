import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { OauthFactory } from './application/oauth.factory';
import { MemberRepository } from '../member/repository/member.repository';
import { KakaoOauthClient } from './application/kakao-oauth.client';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubOauthClient } from './application/github-oauth.client';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './presentation/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    OauthFactory,
    KakaoOauthClient,
    GithubOauthClient,
    JwtStrategy,
  ],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MemberRepository]),
    JwtModule.register({
      secret: process.env.JWT_TOKEN_SECRET,
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
