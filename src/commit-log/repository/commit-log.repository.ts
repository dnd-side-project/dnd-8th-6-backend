import { EntityRepository, Repository } from 'typeorm';
import { CommitLog } from '../domain/commit-log.entity';

@EntityRepository(CommitLog)
export class CommitLogRepository extends Repository<CommitLog> {}
