import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return req.user;
});
