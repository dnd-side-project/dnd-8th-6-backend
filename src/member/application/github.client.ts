import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GithubInfoResponseDto } from './dto/github-info-response.dto';

@Injectable()
export class GithubClient {
  private REQUEST_INFO_URL = 'https://api.github.com/users/';
  private PERSONAL_ACCESS_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  private HEADER = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
      Authorization: 'token ' + this.PERSONAL_ACCESS_TOKEN,
    },
  };

  constructor(private readonly httpService: HttpService) {}

  public async getGithubInfo(githubId: string) {
    const requestInfoUrl = this.REQUEST_INFO_URL + githubId;

    const response = await firstValueFrom(
      this.httpService.get(requestInfoUrl, this.HEADER),
    );

    const data = response.data;

    const totalStars = await this.getStars(data.repos_url, data.public_repos);

    return new GithubInfoResponseDto(
      data.login,
      data.url,
      data.followers,
      totalStars,
      data.public_repos,
      data.repos_url,
      data.created_at,
    );
  }

  private async getStars(repositoryUrl: string, repository: number) {
    const maxPage = Math.floor(repository / 100) + 1;
    let totalStars = 0;

    for (let page = 1; page <= maxPage; page++) {
      const requestRepositoryUrl = `${repositoryUrl}?per_page=100&page=${page}`;

      const response = await firstValueFrom(
        this.httpService.get(requestRepositoryUrl, this.HEADER),
      );

      const repos: object[] = response.data;
      repos.forEach((repo) => (totalStars += repo['stargazers_count']));
    }
    return totalStars;
  }
}
