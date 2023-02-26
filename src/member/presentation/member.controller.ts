import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from '../application/member.service';
import { MemberResponseDto } from './dto/member-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetMember } from '../../auth/presentation/get-member.decorator';
import { Member } from '../domain/member.entity';
import { UpdateMemberRequestDto } from './dto/update-member-request.dto';
import { ProfileService } from '../application/profile.service';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { BlogService } from '../application/blog.service';
import { BlogRequestDto } from './dto/blog-request.dto';
import { BlogResponseDto } from './dto/blog-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { GithubInfoResponseDto } from '../application/dto/github-info-response.dto';
import { GithubContribution } from '../application/dto/github-contribution-response.dto';

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly profileService: ProfileService,
    private readonly blogService: BlogService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberResponseDto> {
    return await this.memberService.getMemberById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/github')
  async getGithubInfoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GithubInfoResponseDto> {
    return await this.memberService.getGithubInfoById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/github/contribution')
  async getGithubContributionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GithubContribution[]> {
    return await this.memberService.getGithubContributionById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getMemberList(
    @Query('name') name: string,
  ): Promise<MemberResponseDto[]> {
    return await this.memberService.getMemberList(name);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateMember(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberRequestDto: UpdateMemberRequestDto,
  ): Promise<MemberResponseDto> {
    if (member.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.memberService.updateMember(id, updateMemberRequestDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteMember(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body('refreshToken') refreshToken: string,
  ): Promise<void> {
    if (member.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.memberService.deleteMember(id, refreshToken);
  }

  @Get('/:id/profile')
  async getMemberProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProfileResponseDto> {
    return await this.profileService.getProfile(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id/profile')
  async updateMemberProfile(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    if (member.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.profileService.updateProfile(id, updateProfileRequestDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/blog')
  async getBlogInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogResponseDto> {
    return await this.blogService.getBlogInfo(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/blog')
  async createBlogInfo(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() blogRequestDto: BlogRequestDto,
  ): Promise<BlogResponseDto> {
    if (member.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.blogService.createBlogInfo(id, blogRequestDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id/blog')
  async updateBlogInfo(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() blogRequestDto: BlogRequestDto,
  ): Promise<BlogResponseDto> {
    if (member.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.blogService.updateBlogInfo(id, blogRequestDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/blog')
  async deleteBlogInfo(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (member.id !== id) {
      throw new UnauthorizedException();
    }
    return await this.blogService.deleteBlogInfo(id);
  }
}
