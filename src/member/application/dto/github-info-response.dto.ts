export class GithubInfoResponseDto {
  readonly name: string;
  readonly url: string;
  readonly followers: number;
  readonly totalStars: number;
  readonly repositories: number;
  readonly repositoryUrl: string;
  readonly createdAt: Date;

  constructor(
    name: string,
    url: string,
    followers: number,
    totalStars: number,
    repositories: number,
    repositoryUrl: string,
    createdAt: Date,
  ) {
    this.name = name;
    this.url = url;
    this.followers = followers;
    this.totalStars = totalStars;
    this.repositories = repositories;
    this.repositoryUrl = repositoryUrl;
    this.createdAt = createdAt;
  }
}
