import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { Filter } from 'src/rank/domain/filter.enum';

export class RankDataDto {
  @IsString()
  @IsEnum(Filter)
  filter: Filter;
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page: number;
}