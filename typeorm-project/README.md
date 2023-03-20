<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<br>
<br>

# TypeORM Integration

```sh
$ npm install --save @nestjs/typeorm typeorm mysql2
```

## ormconfit.ts

- TypeORM을 사용해서 Entity 파일들을 실제 데이터베이스 테이블로 생성

```ts
// ormconfig.ts

import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: 'utf8mb4',
  keepConnectionAlive: true,
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: path.join(__dirname, 'src/migrations'),
  },
} as DataSourceOptions);
```

<br>
<br>

# TypeORM Patterns

## Active Record Pattern

- Active Record 패턴
- 레포지토리 레이어를 두지 않고 엔터티 자체에서 직접 접근하여 로직을 수행한다.
- 비교적 작은 서비스에 어울리는 패턴이다.
- 모든 엔터티들은 TypeORM에서 제공하는 BaseEntity를 상속하고 이 BaseEntity에는 대부분의 기본 레포지토리에서 제공하는 메소드들이 담겨있다.

<br>

## Data Mapper Pattern

- Data Mapper 패턴
- 엔터티에 직접 접근하는 방식이 아닌 레포지토리 레이어를 두고 접근한다.

<br>

## Reference

- [TypeORM 공식문서](https://typeorm.io/)
- [DB 가이드](https://dataonair.or.kr/db-tech-reference/d-guide/da-guide/?pageid=1&mod=list&target=&keyword=%EC%A0%95%EA%B7%9C%ED%99%94)
