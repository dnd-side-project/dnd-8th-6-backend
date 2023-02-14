import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from '../../member/domain/member.entity';

export const GetMember = createParamDecorator(
  (data, context: ExecutionContext): Member => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
