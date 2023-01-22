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

### 요청 객체

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

## decorator (데코레이터)

-   함수나 클래스에 첨가해 주는 것 (기능 첨가)
-   재사용성 극대화
-   데코레이터는 반드시 붙여서 사용
