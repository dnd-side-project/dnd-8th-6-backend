import { EntityRepository, Repository } from 'typeorm';
import { DataLogType } from '../domain/log-type.entity';
import { LogType } from '../domain/log-type.enum';

@EntityRepository(DataLogType)
export class DataLogTypeRepository extends Repository<DataLogType> {

    public async findOneLogType(logType: string) {
        const type = await this.createQueryBuilder('d')
        .where('d.logType = :logType', { logType })
        .getOne();
        if (!type) {
        console.log('User not found'); // 데이터가 없을 경우 출력될 문구
        }

        return type;
    }
}
