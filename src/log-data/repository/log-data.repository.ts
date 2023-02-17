import { EntityRepository, Repository } from 'typeorm';
import { LogData } from '../domain/log-data.entity';

@EntityRepository(LogData)
export class LogDataRepository extends Repository<LogData> {}
