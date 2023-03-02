import { PlatformType } from '../../domain/platform-type.enum';
import { Blog } from '../../domain/blog.entity';
import { BlogStatDto } from '../../application/dto/blog-stat.dto';

export class BlogResponseDto {
  readonly blogName: string;
  readonly platformType: PlatformType;
  readonly articleCnt: number;
  readonly stat: BlogStatDto;

  constructor(blog: Blog, blogStat?: BlogStatDto) {
    this.articleCnt = blog.articleCnt;
    this.platformType = blog.platformType;
    this.blogName = blog.blogName;
    this.stat = blogStat ?? null;
  }
}
