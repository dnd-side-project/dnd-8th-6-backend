import { GithubInfoResponseDto } from '../../application/dto/github-info-response.dto';

export class MemberGithubResponseDto {
  readonly name: string;
  readonly url: string;
  readonly followers: number;
  readonly totalStars: number;
  readonly repositories: number;
  readonly repositoryUrl: string;
  readonly createdAt: Date;
  readonly contributions: number;
  readonly consecutiveCommits: number;

  constructor(
    githubInfoResponseDto: GithubInfoResponseDto,
    contributions: number,
    consecutiveCommits: number,
  ) {
    this.name = githubInfoResponseDto.name;
    this.url = githubInfoResponseDto.url;
    this.followers = githubInfoResponseDto.followers;
    this.totalStars = githubInfoResponseDto.followers;
    this.repositories = githubInfoResponseDto.followers;
    this.repositoryUrl = githubInfoResponseDto.repositoryUrl;
    this.createdAt = githubInfoResponseDto.createdAt;
    this.contributions = contributions;
    this.consecutiveCommits = consecutiveCommits;
  }
}
