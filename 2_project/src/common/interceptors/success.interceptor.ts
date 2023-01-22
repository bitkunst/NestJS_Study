import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // controller 실행 이전,, => middleware에서 주로 처리
        console.log('Before...');

        // controller가 먼저 실행되기 때문에 controller에서 return한 값을 data로 받는다.
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
            })),
        );
    }
}
