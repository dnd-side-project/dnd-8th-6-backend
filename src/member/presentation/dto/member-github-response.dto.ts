import { GithubInfoResponseDto } from '../../application/dto/github-info-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MemberGithubResponseDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
  @ApiProperty()
  readonly followers: number;
  @ApiProperty()
  readonly totalStars: number;
  @ApiProperty()
  readonly repositories: number;
  @ApiProperty()
  readonly repositoryUrl: string;
  @ApiProperty()
  readonly createdAt: Date;
  @ApiProperty()
  readonly contributions: number;
  @ApiProperty()
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
