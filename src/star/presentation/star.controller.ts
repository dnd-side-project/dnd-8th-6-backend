import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StarService } from '../application/star.service';
import { AuthGuard } from '@nestjs/passport';
import { GetMember } from '../../auth/presentation/get-member.decorator';
import { Member } from '../../member/domain/member.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Star')
@Controller('star')
export class StarController {
  constructor(private readonly starService: StarService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId')
  public async getStarInfo(@Param('memberId', ParseIntPipe) memberId: number) {
    return await this.starService.getStarList(memberId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('/:memberId')
  public async followMember(
    @GetMember() member: Member,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return await this.starService.followMember(member, memberId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:memberId')
  public async unfollowMember(
    @GetMember() member: Member,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return await this.starService.unfollowMember(member, memberId);
  }
}
