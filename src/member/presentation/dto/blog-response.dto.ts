import { PlatformType } from '../../domain/platform-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Blog } from '../../domain/blog.entity';
import { BlogStatDto } from '../../application/dto/blog-stat.dto';

export class BlogResponseDto {
  @ApiProperty()
  readonly blogName: string;
  @ApiProperty()
  readonly platformType: PlatformType;

  @ApiProperty({ description: '전체 포스팅 개수' })
  readonly totalArticles: number;

  @ApiProperty({ description: '이번달 포스팅 개수' })
  readonly articleThisMonth: number;

  @ApiProperty({ description: '지난달 포스팅 개수' })
  readonly articleLastMonth: number;

  @ApiProperty({ description: '월 평균 포스팅 개수' })
  readonly monthlyArticleAverage: number;

  @ApiProperty({ description: '포스팅 사이클 (day)' })
  readonly articlePostingCycle: number;

  constructor(blog: Blog, blogStat?: BlogStatDto) {
    this.blogName = blog.blogName;
    this.platformType = blog.platformType;
    this.totalArticles = blogStat?.totalArticles ?? 0;
    this.articleThisMonth = blogStat?.articleThisMonth ?? 0;
    this.articleLastMonth = blogStat?.articleLastMonth ?? 0;
    this.monthlyArticleAverage = blogStat?.monthlyArticleAverage ?? 0;
    this.articlePostingCycle = blogStat?.articlePostingCycle ?? 0;
  }
}
