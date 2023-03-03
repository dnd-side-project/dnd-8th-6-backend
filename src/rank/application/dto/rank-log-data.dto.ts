import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { LogType } from 'src/rank/domain/log-type.enum';

export class LogDataDto {
  @IsString()
  @IsEnum(LogType)
  filter: string;

  @IsNumber()
  page: number;

  @IsNumber()
  logTypeId: number;

  @IsInt()
  @IsOptional()
  dataLog?: number;
}