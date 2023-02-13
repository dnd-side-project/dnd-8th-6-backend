import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarRepository } from './repository/star.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StarRepository])],
  providers: [],
})
export class StarModule {}
