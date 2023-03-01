import { EntityRepository, Repository } from 'typeorm';
import { DataLogType } from '../domain/log-type.entity';

@EntityRepository(DataLogType)
export class DataLogTypeRepository extends Repository<DataLogType> {

    public async findOneLogType(logType: string) {
        const type = await this.createQueryBuilder('d')
        .where('d.logType = :logType', { logType })
        .getOne();
        if (!type) {
            console.log('not found');
        }

        return type;
    }
}
