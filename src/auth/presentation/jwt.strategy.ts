import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Member } from '../../member/domain/member.entity';
import { MemberRepository } from '../../member/repository/member.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly memberRepository: MemberRepository) {
    super({
      secretOrKey: process.env.JWT_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload): Promise<Member> {
    const { id, type } = payload;

    const member = this.memberRepository.findOne(id);

    if (type !== 'access_token' || !member) {
      throw new UnauthorizedException();
    }

    return member;
  }
}
