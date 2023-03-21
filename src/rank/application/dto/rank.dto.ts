import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RankDto {
  @ApiProperty()
  @IsNumber()
  memberId: number;

  @ApiProperty()
  @IsNumber()
  starId: number | null;

  @ApiProperty()
  @IsString()
  name: string;  
  
  @ApiProperty()
  @IsString()
  profileImageurl: string;

  @ApiProperty()
  @IsNumber()
  ranking: number;

  @ApiProperty()
  @IsNumber()
  dataLog: number;

  @ApiProperty()
  @IsNumber()
  logTypeId: number;

  @ApiProperty()
  @IsString()
  upDown: string | null;
}


export class userRankDto {
  @ApiProperty()
  STAR: RankDto[];

  @ApiProperty()
  COMMIT: RankDto[];

  @ApiProperty()
  COMMITDATE: RankDto[];

  @ApiProperty()
  ARTICLECNT: RankDto[];
}

export class RankWithHostDto {
  @ApiProperty()
  hostRank: RankDto | null;
  
  @ApiProperty({type: [RankDto]})
  rankData: RankDto[];
}