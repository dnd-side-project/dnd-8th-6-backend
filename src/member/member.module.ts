import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from './repository/member.repository';
import { MemberController } from './presentation/member.controller';
import { MemberService } from './application/member.service';
import { BlogRepository } from './repository/blog.repository';
import { ProfileRepository } from './repository/profile.repository';
import { ProfileService } from './application/profile.service';
import { BlogService } from './application/blog.service';
import { GithubClient } from './application/github.client';
import { HttpModule } from '@nestjs/axios';
import { Crawler } from './application/crawler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberRepository,
      BlogRepository,
      ProfileRepository,
    ]),
    HttpModule,
  ],
  providers: [MemberService, ProfileService, BlogService, GithubClient, Crawler],
  controllers: [MemberController],
})
export class MemberModule {}
