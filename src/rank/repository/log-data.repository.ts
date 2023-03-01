import { EntityRepository, Repository } from 'typeorm';
import { LogDataDto } from '../application/dto/LogData.dto';
import { LogData } from '../domain/log-data.entity';

@EntityRepository(LogData)
export class LogDataRepository extends Repository<LogData> {

    public async upsertLogData(logData: LogDataDto): Promise<LogData> {
        const existingLogData = await this.findOne({
            where: {
                logDate: logData.logDate,
                memberId: logData.memberId,
                logTypeId: logData.logTypeId,
            }
            });
    
        if (existingLogData) {
            const updatedLogData = { ...existingLogData, dataLog: logData.dataLog };
            return await this.save(updatedLogData);
        }
    
        const newLogData = this.create({
            logDate: logData.logDate,
            memberId: logData.memberId,
            logTypeId: logData.logTypeId,
            dataLog: logData.dataLog,
          });
        return await this.save(newLogData);
    }
}
