import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable()
export class NaverCollector {
  private baseUrl: string = null;
  private xmlData: any;
  private header= {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  private _jsonData: any;
  private _author: string = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly xml2jsParser: xml2js.Parser
  ) {
  }

  async getBlogData(): Promise<void> {
    const res = await firstValueFrom(this.httpService.get(this.setBaseUrl(0), this.header));
    const data = res.data.replace(/"pagingHtml":.*>",/, '');    
    const totalCount = (Math.ceil(parseInt(JSON.parse(data).totalCount)/30));

    this.xmlData = (await Promise.all(Array.from({ length: totalCount }, (_, i) => i + 1).map(async (num) => {
      const res = await firstValueFrom(this.httpService.get(this.setBaseUrl(num), this.header));
      res.data = JSON.parse(res.data.replace(/"pagingHtml":.*>",/, ''));

      return res.data.postList;
    }))).reduce((acc, cur) => [...acc, ...cur], []);
  }

  async convertXml2Json(): Promise<void> {
    this._jsonData = this.xmlData.map(e => {
      return {
        title: decodeURIComponent(e.title),
        pubDate: new Date(e.addDate.replace(/\./g, '-'))
      };
    });
  }

  setBaseUrl(pageNo: number): string {
    return this.baseUrl.replace('nbcurPage', pageNo.toString());
  }

  set author(author:string) {
    this._author = author;
    this.baseUrl = `https://blog.naver.com/PostTitleListAsync.naver?blogId=${author}&viewdate=&currentPage=nbcurPage&categoryNo=0&parentCategoryNo=&countPerPage=30`;
  }

  get jsonData() {
    return this._jsonData;
  }
}
