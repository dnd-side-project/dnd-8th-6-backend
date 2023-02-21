import { EntityRepository, Repository } from 'typeorm';
import { Profile } from '../domain/profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {}
