import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberRepository } from "./repository/member.repository";
import { MemberController } from "./presentation/member.controller";
import { MemberService } from "./application/member.service";

@Module({
  imports: [TypeOrmModule.forFeature([MemberRepository])],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
