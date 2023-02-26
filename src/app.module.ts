import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { StarModule } from './star/star.module';
import { RankModule } from './rank/rank.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    MemberModule,
    AuthModule,
    RankModule,
    StarModule,
  ],
})
export class AppModule {}
