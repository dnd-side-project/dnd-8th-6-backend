import { EntityRepository, Repository } from 'typeorm';
import { Member } from '../domain/member.entity';

@EntityRepository(Member)
export class MemberRepository extends Repository<Member> {}
