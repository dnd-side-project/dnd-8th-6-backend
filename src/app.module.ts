import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { CommitLogModule } from './commit-log/commit-log.module';
import { BlogModule } from './blog/blog.module';
import { ProfileModule } from './profile/profile.module';
import { StarModule } from './star/star.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeORMConfig),
        UserModule,
        MemberModule,
        AuthModule,
        BlogModule,
        CommitLogModule,
        ProfileModule,
        StarModule,
    ],
})
export class AppModule {}
