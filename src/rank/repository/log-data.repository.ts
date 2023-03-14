import { Member } from 'src/member/domain/member.entity';
import { EntityRepository, Repository } from 'typeorm';
import { LogDataDto } from '../application/dto/log-data.dto';
import { RankDataDto } from '../application/dto/rank-log-data.dto';
import { RankSearchDto } from '../application/dto/rank-search.dto';
import { RankDto } from '../application/dto/rank.dto';
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

    public async getRankByLogData(rankDataDto: RankDataDto, member: Member): Promise<RankDto[]> {
        const { filter, page } = rankDataDto;
        const aggregationFunction = filter === 'COMMITDATE' ? 'MAX' : 'SUM';
        const results = await this.query(
            `
            select today_rank.member_id as memberId,
                s.id as starId,
                m.name,
                m.profile_image_url as profileImageUrl,
                today_rank.ranking, 
                today_rank.data_log as dataLog, 
                today_rank.log_type_id as logTypeId,
                    CASE
                        WHEN today_rank.ranking > yesterday_rank.ranking THEN 'up'
                        WHEN today_rank.ranking < yesterday_rank.ranking THEN 'down'
                        WHEN today_rank.ranking = yesterday_rank.ranking THEN 'unchanged'
                        ELSE null
                    END AS upDown
                from (
                    SELECT
                    rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                    ${aggregationFunction}(ld.data_log) as data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) >= DATE_FORMAT(NOW() ,'%Y-%m-01')
                    AND dlt.log_type = '${filter}'
                    group by ld.member_id, ld.member_id
                    order by ranking asc, ld.member_id asc) as today_rank
                left outer join (
                    SELECT
                    rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                    ${aggregationFunction}(ld.data_log) as data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH ,'%Y-%m-01') AND DATE(NOW() - INTERVAL 1 DAY)
                    AND dlt.log_type = '${filter}'
                    group by ld.member_id, ld.member_id
                    ) as yesterday_rank
                    on today_rank.member_id = yesterday_rank.member_id
                left join member as m
                    on today_rank.member_id = m.id
                left join (
                    select id, member_id, following_id from star
                        where member_id = '${member.id}'
                    ) as s
                    on today_rank.member_id = s.following_id
                order by today_rank.ranking asc, today_rank.member_id asc
                LIMIT 20 OFFSET ${(page - 1) * 10};`
        );

        return results
            .map((rank) => {
                rank.ranking = parseInt(rank.ranking);
                return rank;
            })
            .sort(function(a, b){ return a.ranking-b.ranking; });
    }

    public async getRankByKeaword(rankSearchDto: RankSearchDto, member: Member): Promise<RankDto[]> {
        const { keyword, filter, page } = rankSearchDto;
        const aggregationFunction = filter === 'COMMITDATE' ? 'MAX' : 'SUM';

        const results = await this.query(
            `
            select today_rank.member_id as memberId,
                s.id as starId,
                m.name,
                m.profile_image_url as profileImageUrl,
                today_rank.ranking, 
                today_rank.data_log as dataLog, 
                today_rank.log_type_id as logTypeId,
                    CASE
                        WHEN today_rank.ranking > yesterday_rank.ranking THEN 'up'
                        WHEN today_rank.ranking < yesterday_rank.ranking THEN 'down'
                        WHEN today_rank.ranking = yesterday_rank.ranking THEN 'unchanged'
                        ELSE null
                    END AS upDown
                from (
                    SELECT
                    rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                    ${aggregationFunction}(ld.data_log) as data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) >= DATE_FORMAT(NOW() ,'%Y-%m-01')
                    AND dlt.log_type = '${filter}'
                    group by ld.member_id, ld.member_id
                    order by ranking asc, ld.member_id asc) as today_rank
                left outer join (
                    SELECT
                    rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                    ${aggregationFunction}(ld.data_log) as data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH ,'%Y-%m-01') AND DATE(NOW() - INTERVAL 1 DAY)
                    AND dlt.log_type = '${filter}'
                    group by ld.member_id, ld.member_id
                    ) as yesterday_rank
                    on today_rank.member_id = yesterday_rank.member_id
                left join member as m
                    on today_rank.member_id = m.id
                left join (
                    select id, member_id, following_id from star
                        where member_id = '${member.id}'
                    ) as s
                    on today_rank.member_id = s.following_id
                WHERE m.name LIKE '%${keyword}%'
                order by m.name asc, today_rank.ranking asc, today_rank.member_id asc
                LIMIT 20 OFFSET ${(page - 1) * 10};`
        );

        return results
            .map((rank) => {
                rank.ranking = parseInt(rank.ranking);
                return rank;
            })
            .sort(function(a, b){ return a.ranking-b.ranking; });
    }

    public async getRankWithNeighbors(filter: string, memberId: number): Promise<RankDto[]> {
        const aggregationFunction = filter === 'COMMITDATE' ? 'MAX' : 'SUM';

        
        const results = await this.query(
            `
            select R1.memberId, R1.starId, R1.name, R1.profileImageUrl, R1.ranking, R1.dataLog, R1.logTypeId
            from(
            select today_rank.member_id as memberId,
                s.id as starId,
                m.name,
                m.profile_image_url as profileImageUrl,
                today_rank.ranking, 
                today_rank.data_log as dataLog, 
                today_rank.log_type_id as logTypeId,
                CASE
                        WHEN today_rank.ranking > yesterday_rank.ranking THEN 'up'
                        WHEN today_rank.ranking < yesterday_rank.ranking THEN 'down'
                        WHEN today_rank.ranking = yesterday_rank.ranking THEN 'unchanged'
                        ELSE null
                    END AS upDown
                from (
                    SELECT
                    rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                    ${aggregationFunction}(ld.data_log) as data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) >= DATE_FORMAT(NOW() ,'%Y-%m-01')
                    AND dlt.log_type = '${filter}'
                    group by ld.member_id, ld.member_id
                    order by ranking asc, ld.member_id asc) as today_rank
                left outer join (
                    SELECT
                    rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                    ${aggregationFunction}(ld.data_log) as data_log,
                    ld.log_date,
                    ld.member_id,
                    ld.log_type_id
                    FROM log_data as ld
                    left join data_log_type as dlt
                    on dlt.id = ld.log_type_id
                    WHERE DATE(ld.log_date) BETWEEN DATE_FORMAT(NOW() - INTERVAL 1 MONTH ,'%Y-%m-01') AND DATE(NOW() - INTERVAL 1 DAY)
                    AND dlt.log_type = '${filter}'
                    group by ld.member_id, ld.member_id
                ) as yesterday_rank
                    on today_rank.member_id = yesterday_rank.member_id
                left join member as m
                    on today_rank.member_id = m.id
                left join (
                    select id, member_id, following_id from star
                        where member_id = '${memberId}'
                    ) as s
                    on today_rank.member_id = s.following_id
                ) as R1
                left join(
                    select today_rank.member_id as memberId,
                        m.name,
                        m.profile_image_url as profileImageUrl,
                        today_rank.ranking 
                        from (
                            SELECT
                            rank() over (order by ${aggregationFunction}(data_log) desc) as ranking,
                            ${aggregationFunction}(ld.data_log) as data_log,
                            ld.log_date,
                            ld.member_id,
                            ld.log_type_id
                            FROM log_data as ld
                            left join data_log_type as dlt
                            on dlt.id = ld.log_type_id
                            WHERE DATE(ld.log_date) >= DATE_FORMAT(NOW() ,'%Y-%m-01')
                            AND dlt.log_type = 'COMMITDATE'
                            group by ld.member_id, ld.member_id
                            order by ranking asc, ld.member_id asc) as today_rank
                        left join member as m
                            on today_rank.member_id = m.id
                        where today_rank.member_id = '${memberId}'
                        ) as R2
                        on R1.ranking <= R2.ranking + 1 and R1.ranking >= R2.ranking - 1
                        where R2.ranking is not null`
        );

        return results
            .map((rank) => {
                rank.ranking = parseInt(rank.ranking);
                return rank;
            })
            .sort(function(a, b){ return a.ranking-b.ranking; });
    }
}
