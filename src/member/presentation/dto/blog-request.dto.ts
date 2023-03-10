import { PlatformType } from '../../domain/platform-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class BlogRequestDto {
  @ApiProperty({
    enum: ['TISTORY', 'VELOG', 'BRUNCH', 'NAVER'],
    enumName: 'PlatformType',
  })
  readonly platformType: PlatformType;
  @ApiProperty()
  readonly blogName: string;
}
