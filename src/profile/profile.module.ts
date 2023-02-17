import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from './repository/profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileRepository])],
  providers: [],
})
export class ProfileModule {}
