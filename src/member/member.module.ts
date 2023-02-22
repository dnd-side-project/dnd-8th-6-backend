import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from './repository/member.repository';
import { MemberController } from './presentation/member.controller';
import { MemberService } from './application/member.service';
import { BlogRepository } from './repository/blog.repository';
import { ProfileRepository } from './repository/profile.repository';
import { ProfileService } from './application/profile.service';
import { BlogService } from './application/blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberRepository,
      BlogRepository,
      ProfileRepository,
    ]),
  ],
  providers: [MemberService, ProfileService, BlogService],
  controllers: [MemberController],
})
export class MemberModule {}
