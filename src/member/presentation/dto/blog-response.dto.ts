import { PlatformType } from '../../domain/platform-type.enum';
import { Blog } from '../../domain/blog.entity';
import { BlogStatDto } from '../../application/dto/blog-stat.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BlogResponseDto {
  @ApiProperty()
  readonly blogName: string;
  @ApiProperty()
  readonly platformType: PlatformType;
  @ApiProperty()
  readonly articleCnt: number;
  @ApiProperty()
  readonly stat: BlogStatDto;

  constructor(blog: Blog, blogStat?: BlogStatDto) {
    this.articleCnt = blog.articleCnt;
    this.platformType = blog.platformType;
    this.blogName = blog.blogName;
    this.stat = blogStat ?? null;
  }
}
