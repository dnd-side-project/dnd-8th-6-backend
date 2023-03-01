import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import { GithubContribution } from './dto/github-contribution-response.dto';

@Injectable()
export class Crawler {
  private browser: Browser = null;
  private page: Page = null;
  private baseUrl = 'https://github.com';
  private contributionTag: ElementHandle<Element>[] = null;
  private githubContribution = null;

  async setConfig() {
    this.browser = await puppeteer.launch({
      headless: true,
    });
    this.page = await this.browser.newPage();
  }

  async accessSite(githubId: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}/${githubId}`);
  }

  async accessSiteWithYear(githubId: string, year: number) {
    await this.page.goto(
      `${this.baseUrl}/${githubId}?tab=overview&from=${year}-01-01&to=${year}-12-31`,
    );
  }

  async collecteContributionTag(): Promise<void> {
    await this.page.waitForSelector('.ContributionCalendar-day', {
      timeout: 1000,
    });
    this.contributionTag = await this.page.$$('.ContributionCalendar-day');
  }

  async collectYearTags(): Promise<void> {
    await this.page.waitForSelector('.js-year-link', {
      timeout: 1000,
    });
    this.contributionTag = await this.page.$$('.js-year-link');
  }

  async parseYearTag(): Promise<number[]> {
    return (
      await Promise.all(
        this.contributionTag.map(async (c) => {
          return this.page.evaluate((c) => {
            return {
              year: c.textContent,
            };
          }, c);
        }),
      )
    ).map((data) => Number.parseInt(data.year));
  }

  async parseContributionTag(): Promise<GithubContribution[]> {
    this.githubContribution = (
      await Promise.all(
        this.contributionTag.map(async (c) => {
          return this.page.evaluate((c) => {
            return {
              date: c.getAttribute('data-date'),
              contribution: c.textContent
                .split(/[ ]/g)
                .at(0)
                .replace(/[^0-9]/g, '')
                ? c.textContent
                    .split(/[ ]/g)
                    .at(0)
                    .replace(/[^0-9]/g, '')
                : null,
            };
          }, c);
        }),
      )
    ).filter((e) => e.date);

    return this.githubContribution;
  }

  async closeBrowser(): Promise<void> {
    await this.browser.close();
  }
}
