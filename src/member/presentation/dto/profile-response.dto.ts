import { Profile } from '../../domain/profile.entity';

export class ProfileResponseDto {
  readonly description: string;

  constructor(profile: Profile) {
    this.description = profile.description;
  }
}
