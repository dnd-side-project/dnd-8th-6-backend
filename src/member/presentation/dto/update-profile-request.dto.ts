import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileRequestDto {
  @ApiProperty()
  readonly description: string;
}
