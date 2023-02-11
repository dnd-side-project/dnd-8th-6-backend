import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberRepository } from './repository/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MemberRepository])],
  providers: [],
})
export class MemberModule {}
