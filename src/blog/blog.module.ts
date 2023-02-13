import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogRepository } from './repository/blog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogRepository])],
  providers: [],
})
export class BlogModule {}
