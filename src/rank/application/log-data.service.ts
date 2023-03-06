import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogDataRepository } from '../repository/log-data.repository';
import { RankDataDto } from './dto/rank-log-data.dto';


@Injectable()
export class LogDataService {
  constructor(
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
  ) {}

  public async getRank(rankDataDto: RankDataDto) {
    const rankData = await this.logDataRepository.getRankByLogData(rankDataDto);
    return rankData;
  }
}
