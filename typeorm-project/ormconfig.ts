import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const typeOrmOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  charset: 'utf8mb4',
  keepConnectionAlive: true, //* 데이터베이스 연결을 계속 유지할지 여부
  synchronize: process.env.DB_SYNC === 'true', //! Entity 파일과 데이터베이스 스키마 간의 자동 동기화 (개발 단계에서만 true) , set 'false' in production (production 모드에서는 false로 한 후 migration 진행)
  autoLoadEntities: true, // * 자동으로 entity 로드
  logging: process.env.NODE_ENV === 'development', //! 개발 환경에서만 true 권장
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')], //* Entity 파일들이 있는 경로 지정, 이 경로를 통해 TypeORM은 Entity 파일들을 자동으로 찾아 데이터베이스 테이블과 매핑한다.
  migrations: [path.join(__dirname, 'migrations', '*.ts')], //* 마이그레이션 파일들이 있는 경로를 지정, 이 경로를 통해 TypeORM은 마이그레이션 파일들을 자동으로 찾아 데이터베이스 테이블과 매핑한다.
  migrationsTableName: 'migrations', //* 데이터베이스에서 마이그레이션을 추적하는데 사용되는 테이블 이름
  cli: {
    migrationsDir: path.join(__dirname, 'migrations'), //* 마이그레이션 파일들이 있는 디렉토리 지정
  }, //* TypeORM CLI 설정을 저장하는 객체
};

export const AppDataSource = new DataSource(
  typeOrmOptions as DataSourceOptions,
);

/**
 * * DataSource : TypeORM을 사용하여 데이터베이스에 연결하는데 필요한 구성을 저장하는 객체.
 * * DataSourceOptions : TypeORM 설정 옵션에 대한 타입을 지정하는 인터페이스. 이 인터페이스는 DataSource 객체에 올바른 설정 옵션을 전달하는데 도움을 준다.
 */

/*
'src/**': 프로젝트의 'src' 폴더 내부의 모든 하위 폴더를 포함합니다. 이는 패턴이 'src' 폴더의 모든 하위 디렉토리를 탐색하도록 지시합니다.
*.entity.{ts,js}: 파일 이름이 '.entity.ts' 또는 '.entity.js'로 끝나는 파일을 찾습니다. 
이는 엔티티 파일이라고 가정한 파일을 식별하는 데 사용되는 규칙입니다.
따라서 이 패턴은 프로젝트의 'src' 폴더 내부의 모든 하위 폴더에서 '.entity.ts' 또는 '.entity.js'로 끝나는 모든 파일을 찾아 데이터베이스와 매핑할 엔티티로 사용하라는 의미입니다.
이렇게 하면 TypeORM이 자동으로 프로젝트의 모든 엔티티 파일을 찾아 데이터베이스와 매핑할 수 있습니다.
*/
