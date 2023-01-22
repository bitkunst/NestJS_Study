# NestJS Architecture

## src/

### app.controller.ts

-   하나의 라우트가 있는 기본 컨트롤러
-   express의 route 파일과 같다

### app.controller.spec.ts

-   컨트롤러를 위한 유닛 테스트

### app.module.ts

-   애플리케이션의 루트 모듈

### app.service.ts

-   단일 메소드를 사용하는 기본 서비스
-   비즈니스 로직 수행

### main.ts

-   핵심 기능인 NestFactory를 사용하여 Nest 애플리케이션 인스턴스를 생성하는 애플리케이션 entry 파일

<br>
<br>

# Concepts

## controller (컨트롤러)

-   컨트롤러는 들어오는 요청을 처리하고 클라이언트에 응답을 반환한다.
-   컨트롤러의 목적은 애플리케이션에 대한 특정 요청을 수신하는 것이다.
-   ### 요청 객체
    -   데코레이터 사용 가능
    -   request body의 경우 DTO를 사용해서 type 지정을 하고 body에 대한 validation을 평가하는 방식으로 주로 사용

```ts
import { Controller, Get, Req, Body, Param } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hello/:id/:name')
    getHello(@Req() req: Request, @Body() body: BodyDto, @Param() param: { id: string; name: string }): string {
        return this.appService.getHello();
    }
}
```

<br>

## provider (공급자)

-   provider의 주요 아이디어는 종속성을 주입 할 수 있다는 것이다.
-   controller가 소비자라면 service는 제품, provider는 공급자(제품 생산자)
-   AppModule에서 provider를 등록해줘야만 의존성 주입이 가능해진다.
-   controller(소비자)는 provider(공급자)가 제공해준 service(제품)를 주입받아서 사용하게 된다.

<br>

## module (모듈)

-   모듈은 기본적으로 공급자(provider)를 캡슐화(encapsulation) 한다.
-   즉, 현재 모듈의 직접적인 부분이 아니거나 가져온 모듈에서 내보내지 않은 공급자를 삽입할 수 없다.
-   따라서 모듈에서 내보낸 공급자를 모듈의 공용 인터페이스 또는 API로 간주할 수 있다.
-   ### 캡슐화 (encapsulation)
    -   캡슐화 : 객체(object)의 속성과 행위(method)를 하나로 묶고, 구현된 일부를 감추어 은닉한다. (은닉: hiding)
    -   providers는 캡슐화가 되어 있기 때문에 기본적으로 provider에 대한 것들은 다른 모듈에서 사용이 불가하다. (접근 불가)
    -   CatsModule 안에서 providers로 등록된 CatsService는 기본적으로 캡슐화 되어 있기 때문에 다른 모듈에서는 접근이 불가하다.
    -   다른 모듈에서 접근 가능하게끔 해주기 위해서는 **_exports: []_** 안에 CatsService를 넣어주어야 한다.

```ts
@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService],
})
export class CatsModule {}
```

<br>

## middleware (미들웨어)

-   미들웨어는 라우트 핸들러 **이전**에 호출되는 함수이다.
-   Nest 미들웨어는 기본적으로 Express 미들웨어와 동일하다.
-   Nest 미들웨어는 의존성 주입(DI)을 지원한다.

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
    imports: [CatsModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('cats');
    }
}
```

<br>

## exception filter

-   컨트롤러에 적용시 : @UseFilters() 데코레이터를 사용해서 적용
-   global-scoped filter 적용시 : main.ts 에서 app.useGlobalFilters() 사용

```ts
// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const error = exception.getResponse() as
            | string
            | { error: string; statusCode: number; message: string | string[] };

        if (typeof error === 'string') {
            response.status(status).json({
                success: false,
                timestamp: new Date().toISOString(),
                statusCode: status,
                path: request.url,
                error,
            });
        } else {
            response.status(status).json({
                success: false,
                timestamp: new Date().toISOString(),
                ...error,
            });
        }
    }
}
```

<br>

## pipes (파이프)

-   파이프에는 두가지 일반적인 사용 사례가 있다. (변환 & 유효성 검사)
-   <span style="color:violet; font-weight: bold; font-style:italic;">변환</span> : 입력 데이터를 원하는 형식으로 변환 (예: 문자열에서 정수로)
-   <span style="color:violet; font-weight: bold; font-style:italic;">유효성 검사</span> : 입력 데이터를 평가하고 유효하면 변경하지 않고 전달한다. 그렇지 않으면 데이터가 올바르지 않을 때 예외를 발생시킨다.
-   파이프는 단방향 통신을 위한 용도로 사용된다. 하나의 파이프는 이전 파이프에서 전달된 결과를 입력 값으로 받아 또 다른 결과 값을 내놓는다.
-   NestJS에서의 파이프는 클라이언트 요청에서 들어오는 데이터를 유효성 검사 및 변환을 수행하여 서버가 원하는 데이터를 얻을 수 있도록 도와주는 역할을 한다.
-   https://docs.microsoft.com/en-us/azure/architecture/patterns/pipes-and-filters

<br>

## interceptor (인터셉터)

-   인터셉터는 @Injectable() 데코레이터로 주석이 달린 클래스이다. => 의존성 주입(DI)이 가능하다.
-   인터셉터는 NestInterceptor 인터페이스를 구현해야 한다.
-   controller가 return 한 데이터를 받아서 가공할 때 주로 사용

<br>

## decorator (데코레이터)

-   함수나 클래스에 첨가해 주는 것 (기능 첨가)
-   재사용성 극대화
-   데코레이터는 반드시 붙여서 사용

<br>
<br>

# Request LifeCycle

1. Incoming request
2. Globally bound middleware
3. Module bound middleware
4. Global guards
5. Controller guards
6. Route guards
7. Global interceptors (pre-controller)
8. Controller interceptors (pre-controller)
9. Route interceptors (pre-controller)
10. Global pipes
11. Controller pipes
12. Route pipes
13. Route parameter pipes
14. Controller (method handler)
15. Service (if exists)
16. Route interceptor (post-request)
17. Controller interceptor (post-request)
18. Global interceptor (post-request)
19. Exception filters (route, then controller, then global)
20. Server response

<br>
<br>

# Nest CLI

```shell
## module 생성
$ nest g mo [모듈명]

## controller 생성
$ nest g co [컨트롤러명]

## service 생성
$ nest g s [서비스명]

## 미들웨어 생성
$ nest g mi [미들웨어명]

```
