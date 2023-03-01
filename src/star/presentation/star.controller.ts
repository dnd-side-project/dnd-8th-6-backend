import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StarService } from '../application/star.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('star')
export class StarController {
  constructor(private readonly starService: StarService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/:memberId')
  public async getStarInfo(@Param(ParseIntPipe) memberId: number) {
    return await this.starService.getStarList(memberId);
  }
}
