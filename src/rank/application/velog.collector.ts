import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable()
export class VelogCollector {
  private baseUrl: string = null;
  private xmlData: string;
  private _jsonData: any;
  private _author: string = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly xml2jsParser: xml2js.Parser
  ) {
  }

  async getBlogData(): Promise<void> {
    const res = await firstValueFrom(this.httpService.get(this.baseUrl));
    this.xmlData = res.data;
  }

  async convertXml2Json(): Promise<void> {
    this._jsonData = await this.xml2jsParser.parseStringPromise(this.xmlData)
    .then(r => {
      return r.rss.channel[0].item.map(e => {
        return {
            title: e.title[0],
            link: e.link[0],
            guid: e.guid[0],
            pubDate: this.convertDateFormat(e.pubDate[0]),
            description: e.description[0],
        };
      });
    });
  }

  convertDateFormat(date: string): Date|null {
    const dateObject: Date = new Date(date);
    dateObject instanceof Date ? dateObject : null;
    return dateObject;
  }

  set author(author:string) {
    this._author = author; 
    this.baseUrl = `https://api.velog.io/rss/@${author}`;
  }

  get jsonData() {
    return this._jsonData;
  }
}
