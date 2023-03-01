import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogRepository } from '../repository/blog.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../repository/member.repository';
import { BlogRequestDto } from '../presentation/dto/blog-request.dto';
import { BlogResponseDto } from '../presentation/dto/blog-response.dto';
import { Member } from '../domain/member.entity';
import { BlogStatDto } from './dto/blog-stat.dto';
import { LogDataRepository } from '../../rank/repository/log-data.repository';
import { DataLogTypeRepository } from '../../rank/repository/commit-log.repository';
import { LogType } from '../../rank/domain/log-type.enum';
import { DataLogType } from '../../rank/domain/log-type.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogRepository)
    private readonly blogRepository: BlogRepository,
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
    @InjectRepository(LogDataRepository)
    private readonly logDataRepository: LogDataRepository,
    @InjectRepository(DataLogTypeRepository)
    private readonly dataLogTypeRepository: DataLogTypeRepository,
  ) {}

  public async getBlogInfo(id: number): Promise<BlogResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id, {
      relations: ['blog'],
    });

    if (!member.blog) {
      throw new BadRequestException('등록된 블로그가 없습니다.');
    }
    const blogStat = await this.getBlogStat(member);
    return new BlogResponseDto(member.blog, blogStat);
  }

  private async getBlogStat(member: Member) {
    // BlogType 의 Id를 얻기 위함
    const blogType = await this.dataLogTypeRepository.findOne({
      where: {
        logType: LogType.ARTICLECNT,
      },
    });

    // 포스트 총 합
    const totalArticles = await this.getTotalArticles(member, blogType);
    // 이번달 포스팅 개수
    const articleThisMonth = await this.getArticlesThisMonth(member, blogType);
    // 저번달 포스팅 개수
    const articleLastMonth = await this.getArticlesLastMonth(member, blogType);
    // 월별 평균 개수
    const monthlyArticleAverage = await this.getArticlesAverageOfMonth(
      member,
      blogType,
    );
    // 포스팅 사이클
    const postingCycles = await this.getPostingCycles(member, blogType);

    return new BlogStatDto(
      totalArticles,
      articleThisMonth,
      articleLastMonth,
      monthlyArticleAverage,
      postingCycles,
    );
  }

  private async getTotalArticles(
    member: Member,
    type: DataLogType,
  ): Promise<number> {
    const logData = await this.logDataRepository
      .createQueryBuilder('data')
      .where('data.memberId = :id', { id: member.id })
      .andWhere('data.log_type_id = :typeId', { typeId: type.id })
      .getMany();

    return logData.reduce((sum, value) => sum + value.dataLog, 0);
  }

  private async getArticlesThisMonth(
    member: Member,
    type: DataLogType,
  ): Promise<number> {
    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('SUM(data.data_log)', 'articles')
      .where('data.memberId = :id', { id: member.id })
      .andWhere('data.log_type_id = :typeId', { typeId: type.id })
      .andWhere('data.log_date >= DATE_FORMAT(NOW(), "%Y-%m-01")')
      .andWhere(
        'data.log_date < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, "%Y-%m-01")',
      )
      .groupBy('DATE_FORMAT(data.log_date, "%Y-%m")')
      .getRawOne<{ articles: number }>();

    if (result) {
      return Number.parseInt(String(result.articles));
    }
    return 0;
  }

  private async getArticlesLastMonth(
    member: Member,
    type: DataLogType,
  ): Promise<number> {
    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('SUM(data.data_log)', 'articles')
      .where('data.memberId = :id', { id: member.id })
      .andWhere('data.log_type_id = :typeId', { typeId: type.id })
      .andWhere(
        'data.log_date >= DATE_FORMAT(NOW() - INTERVAL 1 MONTH, "%Y-%m-01")',
      )
      .andWhere('data.log_date < DATE_FORMAT(NOW(), "%Y-%m-01")')
      .groupBy('DATE_FORMAT(data.log_date, "%Y-%m")')
      .getRawOne<{ articles: number }>();

    if (result) {
      return Number.parseInt(String(result.articles));
    }
    return 0;
  }

  private async getArticlesAverageOfMonth(
    member: Member,
    type: DataLogType,
  ): Promise<number> {
    const result = await this.logDataRepository
      .createQueryBuilder('data')
      .select('AVG(data.data_log)', 'articles')
      .addSelect('DATE_FORMAT(data.log_date, "%Y-%m")', 'm_date')
      .where('data.memberId = :id', { id: member.id })
      .andWhere('data.log_type_id = :typeId', { typeId: type.id })
      .groupBy('DATE_FORMAT(data.log_date, "%Y-%m")')
      .getRawMany<{ articles: number; m_date: string }>();

    if (result.length === 0) {
      return 0;
    }

    const sum = result.reduce(
      (sum, value) => sum + Number.parseFloat(String(value.articles)),
      0,
    );
    return Number.parseFloat((sum / result.length).toFixed(2));
  }

  private async getPostingCycles(
    member: Member,
    type: DataLogType,
  ): Promise<number> {
    const raw = await this.logDataRepository
      .createQueryBuilder('data')
      .select('SUM(data.data_log)', 'articles')
      .addSelect('MAX(log_date) - MIN(log_date)', 'dayDiff')
      .where('data.memberId = :id', { id: member.id })
      .andWhere('data.log_type_id = :typeId', { typeId: type.id })
      .getRawOne<{ articles: number; dayDiff: number }>();

    if (!raw.articles) {
      return 0;
    }

    return Number.parseFloat((raw.dayDiff / raw.articles).toFixed(2));
  }

  public async createBlogInfo(
    id: number,
    blogRequestDto: BlogRequestDto,
  ): Promise<BlogResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id, {
      relations: ['blog'],
    });

    if (member.blog) {
      throw new BadRequestException('이미 등록된 블로그가 존재합니다.');
    }

    const blog = await this.blogRepository.create({
      platformType: blogRequestDto.platformType,
      blogName: blogRequestDto.blogName,
      member: member,
    });

    await this.blogRepository.save(blog);

    return new BlogResponseDto(blog);
  }

  public async updateBlogInfo(
    id: number,
    blogRequestDto: BlogRequestDto,
  ): Promise<BlogResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id, {
      relations: ['blog'],
    });

    if (member.blog) {
      await this.blogRepository.delete(member.blog);
    }

    const blog = await this.blogRepository.create({
      platformType: blogRequestDto.platformType,
      blogName: blogRequestDto.blogName,
      member: member,
    });

    await this.blogRepository.save(blog);

    return new BlogResponseDto(blog);
  }

  public async deleteBlogInfo(id: number): Promise<void> {
    const member = await this.memberRepository.findOneOrThrow(id, {
      relations: ['blog'],
    });

    if (!member.blog) {
      throw new BadRequestException('등록된 블로그가 없습니다.');
    }

    await this.blogRepository.delete(member.blog);
  }
}
