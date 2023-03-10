import { ApiProperty } from '@nestjs/swagger';

export class BlogStatDto {
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

  constructor(
    totalArticles: number,
    articleThisMonth: number,
    articleLastMonth: number,
    monthlyArticleAverage: number,
    articlePostingCycle: number,
  ) {
    this.totalArticles = totalArticles;
    this.articleThisMonth = articleThisMonth;
    this.articleLastMonth = articleLastMonth;
    this.monthlyArticleAverage = monthlyArticleAverage;
    this.articlePostingCycle = articlePostingCycle;
  }
}
