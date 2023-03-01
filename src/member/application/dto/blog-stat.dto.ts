export class BlogStatDto {
  // 전체 포스팅 개수
  readonly totalArticles: number;
  // 이번달 포스팅 개수
  readonly articleThisMonth: number;
  // 저번달 포스팅 개수
  readonly articleLastMonth: number;
  // 월별 평균 개수 소수점 2 반올림
  readonly monthlyArticleAverage: number;
  // 포스팅 사이클 소수점 2 반올림
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
