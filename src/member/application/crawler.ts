import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import { GithubContribution } from './dto/github-contribution-response.dto';


@Injectable()
export class Crawler {
  private browser: Browser = null;
  private page: Page = null;
  private baseUrl = 'https://github.com';
  private contributionTag:ElementHandle<Element>[] = null;
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

  async collecteContributionTag(): Promise<void> {
    await this.page.waitForSelector('.ContributionCalendar-day',{timeout: 1000});
    this.contributionTag = await this.page.$$('.ContributionCalendar-day');
  }

  async parseContributionTag(): Promise<GithubContribution[]> {
    this.githubContribution = (await Promise.all(this.contributionTag.map(async (c) => {
      return this.page.evaluate((c) => {
        return {
          date: c.getAttribute('data-date'),
          contribution: c.textContent.split(/[ ]/g).at(0).replace(/[^0-9]/g, '')
            ? c.textContent.split(/[ ]/g).at(0).replace(/[^0-9]/g, '')
            : null,
        };
      }, c);
    })
    )).filter(e => e.date);

    return this.githubContribution;
  }

  async closeBrowser(): Promise<void> {
    await this.browser.close();
  }
}
