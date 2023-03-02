import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogDataCronService } from '../application/log-data-cron.service';

@Controller('rank')
@ApiTags('rank')
export class RankController {
  constructor(
    private readonly logDataCronService: LogDataCronService,
  ) {}

//   @Get('/:id')
//   async getMemberById(
//     @Param('id', ParseIntPipe) id: number,
//   ): Promise<void> {
//     await this.logDataCronService.collectNaverLog();
//   }
}
