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
