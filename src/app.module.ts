import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { LogDataModule } from './log-data/log-data.module';
import { StarModule } from './star/star.module';
import { DataLogType } from './data-log-type/domain/log-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    MemberModule,
    AuthModule,
    LogDataModule,
    DataLogType,
    StarModule,
  ],
})
export class AppModule {}
