<p align="center">
  <a href="https://docs.nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Database

### MongoDB

```sh
$ npm i --save @nestjs/mongoose mongoose
```

```ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule {}
```

<br>

### configuration variables

```sh
$ npm i --save @nestjs/config
```

-   process.env 환경변수 설정

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

<br>

### validation

```sh
$ npm i --save class-validator class-transformer
```

```ts
// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe()); // 등록
    app.useGlobalFilters(new HttpExceptionFilter());
    const PORT = process.env.PORT;
    await app.listen(PORT);
}
bootstrap();
```

<br>

### .env

```sh
MONGODB_URI=
NODE_ENV=
PORT=
```

<br>
<br>

# Security

### encryption and hashing

```sh
$ npm i bcrypt
$ npm i -D @types/bcrypt
```

<br>
<br>

# DTO (Data Transfer Object)

-   계층간 데이터 교환을 위한 객체
-   DB에서 데이터를 얻어 Service나 Controller 등으로 보낼 때 사용하는 객체
-   Request 와 Response용 DTO는 View를 위한 클래스이다.
-   클라이언트에서 Request Body에 데이터를 실어 보냈을 때, DTO로 만들어서 validation과 타입 검사를 진행.
-   이후 Controller에 DTO 전달, Service 및 DB에 데이터를 전달할 때도 DTO 사용.

<br>
<br>

# API Swagger

```sh
$ npm install --save @nestjs/swagger
```

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
```

<br>
<br>

# Repository 패턴

-   지금까지는 Service에서 비즈니스 로직을 구현할 때 데이터베이스에 직접적으로 접근하는 방식으로 구현하였다.
-   하지만, 데이터베이스에 접근할 때 더 복잡해지는 로직이 발생한다면?
-   비즈니스 로직 자체에 집중하기 어려울 뿐만 아니라, 로직 자체의 테스트도 어려워지며 중복되는 코드의 증가, 가독성 저하 등의 문제가 발생한다.
-   Repository 패턴은 Service 와 Database 사이에 중개자 역할을 하는 Repository가 존재하는 패턴이다.
-   Client -> ... -> Service1, Service2, Service3 -> Repository -> Database
-   Repository 패턴을 사용해 데이터베이스와 직접적으로 연결하는 로직들을 아예 분리시켜 주면 다른 모듈에서 접근할 때는 Repository에만 접근하면 된다.
-   그렇게 되면, 각각의 모듈에서는 비즈니스 로직에만 더 집중할 수 있고 모듈 간의 책임 분리도 확실해진다.
-   또한 Repository 패턴의 핵심은 서비스 레이어에서 데이터의 출처와 관계없이 동일한 방식으로 데이터에 접근할 수 있도록 하는 것이다.
-   Repository가 Service와 DB 사이에서 쿼리를 다듬어주면, 서비스 레이어에서 어떤 데이터베이스를 사용하든지 동일한 방식으로 접근해서 데이터를 핸들링 할 수 있게 된다. (데이터베이스 캡슐화? 라고 생각할 수 있다.)
-   Repository는 데이터베이스 중앙통제실

<br>

```ts
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatRequestDto } from './dto/cats.request.dto';
import { Cat } from './schema/cats.schema';

// Repository 패턴
// Repository는 의존성 주입이 가능한 클래스
@Injectable()
export class CatsRepository {
    constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

    async existsByEmail(email: string): Promise<{ _id: any } | null> {
        // class-validator를 사용했기 때문에 에러가 발생한다면 mongoose에서 에러 처리를 해주기는 한다.
        // 에러 처리를 직접적으로 해줄 필요는 없지만 필요하다면 try-catch를 사용해서 해주면 된다.
        try {
            const result = await this.catModel.exists({ email });
            console.log('result', result);
            return result;
        } catch (err) {
            throw new HttpException('DB error', 400);
        }
    }

    async create(cat: CatRequestDto): Promise<Cat> {
        return await this.catModel.create(cat);
    }
}
```

<br>
<br>

# 로그인

## How

-   세션 & 쿠키 사용
-   JWT 활용
-   토큰 활용

## JWT

JSON Web Tokens; JSON 포맷을 사용해서 사용자에 대한 정보를 저장하는 Web Token이라고 할 수 있다.

-   Header : base64 인코딩, 토큰의 타입과 알고리즘
-   Payload : base64 인코딩 데이터 (key-value)
-   Signature : Header/Payload를 조합하고 비밀키로 서명한 후, base64 인코딩
-   Header.Payload.Signature

<br>
<br>

# Authentication (feat. Passport)

```sh
$ npm install --save @nestjs/passport passport

$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt
```

## 실행 순서

1. 클라이언트 API Request
2. JWT Guard
3. JWT Strategy

-   Passport에서 제공하는 AuthGuard를 주입 받게 되면 JwtStrategy의 validate 함수가 실행된다.
-   validate 함수가 return 한 값이 request.user 객체 안에 들어가게 된다.
-   참고) request 객체에 유저 정보를 저장할 때는 보안상의 이유로 password 필드를 제외하고 저장하는 것이 좋다.

<br>
<br>

# Swagger API 보안 설정

```sh
$ npm install express-basic-auth
```

```ts
import * as expressBasicAuth from 'express-basic-auth';

// Swagger API 보안 설정
app.use(
    ['/api-docs'],
    expressBasicAuth({
        users: {
            [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
        challenge: true,
    }),
);
```

<br>
<br>

# Multer

```sh
$ npm i -D @types/multer
```

<br>

-   단일 파일을 업로드하려면 FileInterceptor() 인터셉터를 라우트 핸들러에 연결하고,
-   @UploadedFile() 데코레이터를 사용하여 request에서 file을 추출하면 된다.

```ts
@Post('upload')
// @UseInterceptors(FileInterceptor('file')) // 단일 파일 업로드
@UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats'))) // 파일 배열 업로드
uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log(file);
}
```

-   FileInterceptor()는 두 개의 인수를 받는다.
-   fieldName : 파일이 있는 HTML 양식에서 필드 이름을 제공하는 문자열 (프론트엔드에서 보내주는 키값)
-   options : MulterOptions 타입의 선택적 객체. 이것은 multer 생성자에서 사용하는 것과 동일한 객체이다.

<br>

-   CatsModule에서 MulterModule을 import 해준다.

```ts
MulterModule.register({
    dest: './upload',
});
```

-   업로드된 파일을 확인하기 위해서는 dist/ 디렉토리 참조
-   dist/ 는 src/ 가 Typescript에서 Javascript로 컴파일된 것
-   Node.js는 컴파일된 Javascript를 실제로 실행하는 것 (만들 때는 Typescript로 만들고 실행시킬 때는 Javascript로 실행)

<br>

-   업로드된 파일이 있는 폴더의 경로를 데이터베이스에 저장
-   서버에 있는 static 파일들을 제공하기 위해 main.ts에서 미들웨어 추가

```ts
// INestApplication 안에는 useStaticAssets 메소드 존재 X
// app이 express application 이라는 것을 명시해줘야 한다.
const app = await NestFactory.create<NestExpressApplication>(AppModule); // generic으로 추가

// http://localhost:4000/media/cats/blockchain.jpg
app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/media',
});
// prefix 옵션이 없었다면 http://localhost:4000/cats/blockchain.jpg
```
