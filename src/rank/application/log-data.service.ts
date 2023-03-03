import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogDataRepository } from '../repository/log-data.repository';


@Injectable()
export class LogDataService {
  constructor(
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
  ) {}

  public async getBlogInfo(id: number): Promise<any> {
    return '1';
  }
}
