import { PlatformType } from '../../domain/platform-type.enum';
import { Blog } from '../../domain/blog.entity';

export class BlogResponseDto {
  readonly articleCnt: number;
  readonly platformType: PlatformType;
  readonly blogName: string;

  constructor(blog: Blog) {
    this.articleCnt = blog.articleCnt;
    this.platformType = blog.platformType;
    this.blogName = blog.blogName;
  }
}
