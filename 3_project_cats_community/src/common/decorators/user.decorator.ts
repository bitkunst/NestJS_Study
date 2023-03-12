// 커스텀 데코레이터 제작
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// request.user를 반환하는 데코레이터
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
