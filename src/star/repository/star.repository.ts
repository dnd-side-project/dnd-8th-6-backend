import { EntityRepository, Repository } from 'typeorm';
import { Star } from '../domain/star.entity';

@EntityRepository(Star)
export class StarRepository extends Repository<Star> {}
