import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async getMemberById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MemberResponseDto> {
    return await this.memberService.getMemberById(id);
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
  ) {
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
  async getMemberProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.profileService.getProfile(id);
  }

  @Put('/:id/profile')
  async updateMemberProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
  ) {
    return await this.profileService.updateProfile(id, updateProfileRequestDto);
  }
}
