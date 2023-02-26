import { PlatformType } from '../../domain/platform-type.enum';

export class BlogRequestDto {
  readonly platformType: PlatformType;
  readonly blogName: string;
}
