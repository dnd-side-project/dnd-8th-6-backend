import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarRepository } from './repository/star.repository';
import { StarService } from './application/star.service';
import { StarController } from './presentation/star.controller';
import { MemberRepository } from '../member/repository/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StarRepository, MemberRepository])],
  providers: [StarService],
  controllers: [StarController],
  exports: [StarService],
})
export class StarModule {}
