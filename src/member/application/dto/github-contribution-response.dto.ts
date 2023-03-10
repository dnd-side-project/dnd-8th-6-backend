import { ApiProperty } from '@nestjs/swagger';

export class GithubContributionResponseDto {
  @ApiProperty()
  readonly GithubContributions: GithubContribution[];
}

export class GithubContribution {
  @ApiProperty()
  date: string;
  @ApiProperty()
  contribution: string;

  constructor(date: string, contribution: string) {
    this.date = date;
    this.contribution = contribution;
  }
}
