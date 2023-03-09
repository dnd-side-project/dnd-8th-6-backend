import {
  Controller, Get, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetMember } from 'src/auth/presentation/get-member.decorator';
import { Member } from 'src/member/domain/member.entity';
import { RankDataDto } from '../application/dto/rank-log-data.dto';
import { RankDto } from '../application/dto/rank.dto';
import { RankSearchDto } from '../application/dto/rank-search.dto';
import { LogDataService } from '../application/log-data.service';
import { Filter } from '../domain/filter.enum';

@Controller('rank')
@ApiTags('rank')
export class RankController {
  constructor(private readonly logDataService: LogDataService) {}

  @ApiOperation({ summary: '특정 기준에 따른 user 랭킹 반환 API' })
  @ApiQuery({ name: 'filter', description: 'ranking을 매기는 특정 기준', enum: Filter, example: Filter.COMMITDATE, required: true })
  @ApiQuery({ name: 'page', description: '원하는 page의 값', type: Number, example: 1, required: true })
  @ApiOkResponse({ type: [RankDto] })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @UsePipes(new ValidationPipe())
  public async getRankByFilter(
    @GetMember() member: Member,
    @Query() rankDataDto: RankDataDto,
  ): Promise<RankDto[]>  {
    return await this.logDataService.getRank(rankDataDto, member);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  @UsePipes(new ValidationPipe())
  public async getSearchWithRank(
    @GetMember() member: Member,
    @Query() rankSearchDto: RankSearchDto,
  ): Promise<RankDto[]>  {
    return await this.logDataService.getRankByKeaword(rankSearchDto, member);
  }
}