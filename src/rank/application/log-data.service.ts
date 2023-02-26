import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class LogDataService {

  async getGitHubHistory(githubId: string): Promise<string> {
    // 페이지 접근
    const base_uri = `https://github.com/${githubId}`;
    const chrome = await this.setConfig();
    await chrome.page.goto(base_uri);

    // 데이터 파싱
    await chrome.page.waitForSelector('.ContributionCalendar-day');
    const contribution = await chrome.page.$$('.ContributionCalendar-day');
    const res = await Promise.all(contribution.map(async (c) => {
      return chrome.page.evaluate((c) => {
        return {
          date: c.getAttribute('data-date'),
          con:  c.textContent.split(/[ ]/g).at(0).replace(/[^0-9]/g, '') 
            ? c.textContent.split(/[ ]/g).at(0).replace(/[^0-9]/g, '') 
            : null,
        };
      }, c);
    })
    );
    await chrome.browser.close();

    console.log(res);
    return githubId;
  }

  async setConfig() {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    return {browser, page};
  }
}
