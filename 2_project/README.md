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

### decorator (데코레이터)

-   함수나 클래스에 첨가해 주는 것 (기능 첨가)
-   재사용성 극대화
-   데코레이터는 반드시 붙여서 사용
