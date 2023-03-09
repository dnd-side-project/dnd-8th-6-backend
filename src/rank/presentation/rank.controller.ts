import {
  Controller, Get, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetMember } from 'src/auth/presentation/get-member.decorator';
import { Member } from 'src/member/domain/member.entity';
import { RankDataDto } from '../application/dto/rank-log-data.dto';
import { RankDto } from '../application/dto/rank.dto';
import { LogDataService } from '../application/log-data.service';

@Controller('rank')
@ApiTags('rank')
export class RankController {
  constructor(private readonly logDataService: LogDataService) {}

  @ApiOperation({ summary: '특정 기준에 따른 user 랭킹 반환 API' })
  @ApiQuery({ name: 'filter', type: String, required: true })
  @ApiQuery({ name: 'page', type: Number, required: true })
  @ApiOkResponse({ type: [RankDto] }) // 배열 타입 사용
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @UsePipes(new ValidationPipe())
  public async followToggle(
    @GetMember() member: Member,
    @Query() rankDataDto: RankDataDto,
  ): Promise<RankDto[]>  {
    return await this.logDataService.getRank(rankDataDto, member);
  }
}
