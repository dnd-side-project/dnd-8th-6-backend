import { EntityRepository, Repository } from 'typeorm';
import { DataLogType } from '../domain/data-log-type.entity';

@EntityRepository(DataLogType)
export class DataLogTypeRepository extends Repository<DataLogType> {}
