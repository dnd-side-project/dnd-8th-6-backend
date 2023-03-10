import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/domain/member.entity';
import { LogDataRepository } from '../repository/log-data.repository';
import { RankDataDto } from './dto/rank-log-data.dto';
import { RankSearchDto } from './dto/rank-search.dto';
import { RankDto } from './dto/rank.dto';


@Injectable()
export class LogDataService {
  constructor(
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
  ) {}

  public async getRank(rankDataDto: RankDataDto, member: Member): Promise<RankDto[]>  {
    const rankData = await this.logDataRepository.getRankByLogData(rankDataDto, member);

    return this.moveMemberToFirst(rankData, member.id);
  }

  public async getRankByKeaword(rankSearchDto: RankSearchDto, member: Member): Promise<RankDto[]>  {
    const rankData = await this.logDataRepository.getRankByKeaword(rankSearchDto, member);

    return rankData;
  }

  public moveMemberToFirst(rankData: RankDto[], memberId: number) {
    const index = rankData.findIndex((item) => item.memberId === memberId);

    if (index === -1)
      return rankData;

    const item = rankData.splice(index, 1)[0];
    rankData.unshift(item);

    return rankData;
  }
}
