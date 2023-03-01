import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class LogDataDto {
  @IsDate()
  logDate: Date;

  @IsString()
  memberId: number;

  @IsNumber()
  logTypeId: number;

  @IsInt()
  @IsOptional()
  dataLog?: number;

  constructor(
    logDate: Date,
    memberId: number,
    logTypeId: number,
    dataLog: number,
  ) {
    this.logDate = logDate;
    this.memberId = memberId;
    this.logTypeId = logTypeId;
    this.dataLog = dataLog;
  }
}