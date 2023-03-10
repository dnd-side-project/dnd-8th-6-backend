import {
  Controller, Get, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RankDataDto } from '../application/dto/rank-log-data.dto';
import { LogDataService } from '../application/log-data.service';

@Controller('rank')
@ApiTags('rank')
export class RankController {
  constructor(private readonly logDataService: LogDataService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  @UsePipes(new ValidationPipe())
  public async followToggle(
    @Query() rankDataDto: RankDataDto,
  ) {
    return await this.logDataService.getRank(rankDataDto);
  }
}
