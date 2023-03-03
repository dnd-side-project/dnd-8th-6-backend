import { Profile } from '../../domain/profile.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  readonly description: string;

  constructor(profile: Profile) {
    this.description = profile.description;
  }
}
