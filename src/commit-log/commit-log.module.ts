import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitLogRepository } from './repository/commit-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommitLogRepository])],
  providers: [],
})
export class CommitLogModule {}
