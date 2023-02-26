import { Controller, Get, Query } from '@nestjs/common';
import { LogDataService } from '../application/log-data.service';


@Controller('scraping')
export class LogDataController {
  constructor(private readonly logDataService: LogDataService) {}

  @Get('/github')
  async getGithubData(@Query('id') id: string): Promise<string> {
    return await this.logDataService.getGitHubHistory(id);
  }
}
