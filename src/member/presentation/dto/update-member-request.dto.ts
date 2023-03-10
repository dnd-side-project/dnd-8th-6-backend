import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberRequestDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly githubId: string;
}
