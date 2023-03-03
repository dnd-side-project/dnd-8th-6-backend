import {
  Controller, Get, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetMember } from 'src/auth/presentation/get-member.decorator';
import { Member } from 'src/member/domain/member.entity';
import { LogDataService } from '../application/log-data.service';

@Controller('rank')
@ApiTags('rank')
export class RankController {
  constructor(private readonly logDataService: LogDataService) {}

  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId')
  public async followToggle(
    @GetMember() member: Member,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Query('filter') filter: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.logDataService.getBlogInfo(memberId);
  }
}
