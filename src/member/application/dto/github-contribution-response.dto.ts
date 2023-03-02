export class GithubContributionResponseDto {
  readonly GithubContributions: GithubContribution[];
}

export class GithubContribution {
  date: string;
  contribution: string;
}
