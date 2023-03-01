import { VelogCollector } from './velog.collector';
import { NaverCollector } from './naver.collector';
import { HttpService } from '@nestjs/axios';
import * as xml2js from 'xml2js';

export async function collectVelogInfo(author: string): Promise<any> {
    const velogCollector = new NaverCollector(new HttpService(), new xml2js.Parser);
    velogCollector.author = author;
    await velogCollector.getBlogData();
    await velogCollector.convertXml2Json();
    return velogCollector.jsonData;
  }
