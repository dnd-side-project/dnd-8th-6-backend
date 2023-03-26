import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { MemberMainPageResponseDto } from './dto/member-main-page-response.dto';
import { MemberMyPageResponseDto } from './dto/member-my-page-response.dto';

@Controller('member')
@ApiTags('Member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly profileService: ProfileService,
    private readonly blogService: BlogService,
  ) {}

  @ApiOperation({
    summary: '요청자 요약 정보 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 요약 정보',
    type: MemberMainPageResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async getMemberByAccessToken(
    @GetMember() member: Member,
  ): Promise<MemberMainPageResponseDto> {
    return await this.memberService.getMemberSummary(member.id);
  }

  @ApiOperation({
    summary: '사용자 요약 정보 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 요약 정보',
    type: MemberMainPageResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId')
  async getMemberSummary(
    @Param('memberId', ParseIntPipe) memberId: number,
  ): Promise<MemberMainPageResponseDto> {
    return await this.memberService.getMemberSummary(memberId);
  }

  @ApiOperation({
    summary: '사용자 github 정보 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 github 정보',
    type: MemberGithubResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/github')
  async getGithubInfoById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberGithubResponseDto> {
    return await this.memberService.getGithubInfoById(id);
  }

  @ApiOperation({
    summary: '사용자 github contributions 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 github contribution 리스트',
    type: GithubContribution,
    isArray: true,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/github/contribution')
  async getGithubContributionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GithubContribution[]> {
    return await this.memberService.getGithubContributionById(id);
  }

  @ApiOperation({
    summary: '사용자 리스트 조회',
    description:
      '사용자의 리스트를 조회합니다. 이름 또는 github 닉네임으로 검색할 수 있습니다. offset 방식의 페이징 방식이 적용되어 있습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 리스트',
    type: MemberGithubResponseDto,
    isArray: true,
  })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false,
    description: 'default 10',
  })
  @ApiQuery({
    name: 'page',
    type: 'page',
    required: false,
    description: 'default 1',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async getMemberList(
    @Query('name', new DefaultValuePipe('')) name: string,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ): Promise<MemberMainPageResponseDto[]> {
    return await this.memberService.getMemberList(name, size, page);
  }

  @ApiOperation({
    summary: '사용자 정보 수정',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보',
    type: MemberMainPageResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateMember(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberRequestDto: UpdateMemberRequestDto,
  ): Promise<MemberMainPageResponseDto> {
    if (member.id !== id) {
      throw new ForbiddenException();
    }
    return await this.memberService.updateMember(id, updateMemberRequestDto);
  }

  @ApiOperation({
    summary: '사용자 정보 삭제',
    description:
      '사용자의 정보를 삭제합니다. 정상적으로 실행되면 HttpStatusCode 200을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteMember(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body('refreshToken') refreshToken: string,
  ): Promise<void> {
    if (member.id !== id) {
      throw new ForbiddenException();
    }
    return await this.memberService.deleteMember(id, refreshToken);
  }

  @ApiOperation({
    summary: '사용자 프로필 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 정보',
    type: ProfileResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/profile')
  async getMemberProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProfileResponseDto> {
    return await this.profileService.getProfile(id);
  }

  @ApiOperation({
    summary: '사용자 프로필 수정',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 프로필 정보',
    type: ProfileResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id/profile')
  async updateMemberProfile(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
  ): Promise<ProfileResponseDto> {
    if (member.id !== id) {
      throw new ForbiddenException();
    }
    return await this.profileService.updateProfile(id, updateProfileRequestDto);
  }

  @ApiOperation({
    summary: '사용자 블로그 정보 조회',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 블로그 정보',
    type: BlogResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/blog')
  async getBlogInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogResponseDto> {
    return await this.blogService.getBlogInfo(id);
  }

  @ApiOperation({
    summary: '사용자 블로그 정보 등록',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 블로그 정보',
    type: BlogResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/blog')
  async createBlogInfo(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() blogRequestDto: BlogRequestDto,
  ): Promise<BlogResponseDto> {
    if (member.id !== id) {
      throw new ForbiddenException();
    }
    return await this.blogService.createBlogInfo(id, blogRequestDto);
  }

  @ApiOperation({
    summary: '사용자 블로그 정보 수정',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 블로그 정보',
    type: BlogResponseDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Put('/:id/blog')
  async updateBlogInfo(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
    @Body() blogRequestDto: BlogRequestDto,
  ): Promise<BlogResponseDto> {
    if (member.id !== id) {
      throw new ForbiddenException();
    }
    return await this.blogService.updateBlogInfo(id, blogRequestDto);
  }

  @ApiOperation({
    summary: '사용자 블로그 정보 삭제',
    description:
      '사용자 블로그 등록 정보를 삭제합니다. 성공시 HttpStatusCode 200을 반환합니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id/blog')
  async deleteBlogInfo(
    @GetMember() member: Member,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (member.id !== id) {
      throw new ForbiddenException();
    }
    return await this.blogService.deleteBlogInfo(id);
  }
}
