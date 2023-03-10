import { EntityRepository, Repository } from 'typeorm';
import { LogDataDto } from '../application/dto/log-data.dto';
import { RankDataDto } from '../application/dto/rank-log-data.dto';
import { LogData } from '../domain/log-data.entity';
import { DataLogType } from '../domain/log-type.entity';

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

    public async getRankByLogData(rankDataDto: RankDataDto) {
        const { filter, page } = rankDataDto;
        const results = await this.query(
            `
            select today_rank.member_id,
                today_rank.ranking, 
                yesterday_rank.ranking, 
                today_rank.data_log, 
                today_rank.log_type_id,
                    CASE
                        WHEN today_rank.ranking > yesterday_rank.ranking THEN 'up'
                        WHEN today_rank.ranking < yesterday_rank.ranking THEN 'down'
                        WHEN today_rank.ranking = yesterday_rank.ranking THEN 'unchanged'
                        ELSE null
                    END AS up_down
                from (
                    SELECT
                    rank() over (order by data_log desc) as ranking,
                    ld.data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) = DATE(NOW()) AND dlt.log_type = '${filter}'
                    order by ranking asc, ld.member_id asc) as today_rank
                left outer join (
                    SELECT
                    rank() over (order by data_log desc) as ranking,
                    ld.data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) = DATE(NOW() - INTERVAL 1 DAY) AND dlt.log_type = '${filter}'
                ) as yesterday_rank
                    on today_rank.member_id = yesterday_rank.member_id
                WHERE today_rank.ranking BETWEEN ${(page - 1) * 10 + 1} AND 20
                order by today_rank.ranking asc, today_rank.member_id asc;            `
        );

        return results.sort((x, y) => x.ranking.localeCompare(y.ranking));
    }
}
