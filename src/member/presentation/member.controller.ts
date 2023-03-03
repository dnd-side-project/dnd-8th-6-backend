import {
  Body,
  Controller,
  DefaultValuePipe,
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { GithubContribution } from '../application/dto/github-contribution-response.dto';
import { MemberGithubResponseDto } from './dto/member-github-response.dto';

@Controller('member')
@ApiTags('Member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly profileService: ProfileService,
    private readonly blogService: BlogService,
  ) {}

  @ApiOperation({ summary: '사용자 조회', description: '사용자를 조회한다.' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보',
    type: MemberResponseDto,
  })
  @ApiQuery({ name: 'year', type: 'number', required: false })
  @ApiQuery({ name: 'month', type: 'number', required: false })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getMemberById(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
    @Query(
      'month',
      new DefaultValuePipe(new Date().getMonth() + 1),
      ParseIntPipe,
    )
    month: number,
  ): Promise<MemberResponseDto> {
    return await this.memberService.getMemberById(member, id, year, month);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/github')
  async getGithubInfoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberGithubResponseDto> {
    return await this.memberService.getGithubInfoById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/github/contribution')
  async getGithubContributionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GithubContribution[]> {
    return await this.memberService.getGithubContributionById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getMemberList(
    @Query('name') name: string,
  ): Promise<MemberResponseDto[]> {
    return await this.memberService.getMemberList(name);
  }

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/blog')
  async getBlogInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogResponseDto> {
    return await this.blogService.getBlogInfo(id);
  }

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
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
