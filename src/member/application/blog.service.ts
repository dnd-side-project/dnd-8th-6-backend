import { BadRequestException, Injectable } from '@nestjs/common';
import { BlogRepository } from '../repository/blog.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from '../repository/member.repository';
import { BlogRequestDto } from '../presentation/dto/blog-request.dto';
import { BlogResponseDto } from '../presentation/dto/blog-response.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogRepository)
    private readonly blogRepository: BlogRepository,
    @InjectRepository(MemberRepository)
    private readonly memberRepository: MemberRepository,
  ) {}

  public async getBlogInfo(id: number): Promise<BlogResponseDto> {
    const member = await this.memberRepository.findOneOrThrow(id, {
      relations: ['blog'],
    });

    return new BlogResponseDto(member.blog);
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
