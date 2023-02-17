import { EntityRepository, Repository } from 'typeorm';
import { DeleteMemLog } from '../domain/delete-member-log.entity';

@EntityRepository(DeleteMemLog)
export class DeleteMemLogRepository extends Repository<DeleteMemLog> {}
