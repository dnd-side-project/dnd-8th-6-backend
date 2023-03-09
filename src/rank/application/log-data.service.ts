import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/domain/member.entity';
import { LogDataRepository } from '../repository/log-data.repository';
import { RankDataDto } from './dto/rank-log-data.dto';
import { RankDto } from './dto/rank.dto';


@Injectable()
export class LogDataService {
  constructor(
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
  ) {}

  public async getRank(rankDataDto: RankDataDto, member: Member): Promise<RankDto[]>  {
    const rankData = await this.logDataRepository.getRankByLogData(rankDataDto, member);
    return rankData;
  }
}
