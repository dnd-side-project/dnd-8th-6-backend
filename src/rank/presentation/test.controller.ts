import { Controller, Get } from '@nestjs/common';
import { GithubCronService } from '../application/github-cron.service';

@Controller('test')
export class TestController {
  constructor(private readonly githubCronService: GithubCronService) {}

  @Get('')
  public async test() {
    await this.githubCronService.crawlGithubAndSaveOnRepository();
  }

  @Get('/2')
  public async test2() {
    await this.githubCronService.countConsecutiveCommits();
  }
}
