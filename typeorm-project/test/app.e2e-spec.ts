import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// describe : 테스트 단위를 묶는 하나의 함수
describe('AppController (e2e)', () => {
  let app: INestApplication;

  // beforeEach : 테스트 진행 전, 가장 먼저 실행되는 함수
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile(); // app 모듈 컴파일

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it : 하나의 테스트 단위
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('TypeORM in NestJS, Just coding,,');
  });

  describe('hello jest', () => {
    it('two plus two is four', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('/user', () => {
    it('/user (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/user');
      expect(res.statusCode).toBe(401);
    });

    it('/user (POST)', async () => {
      const res = await request(app.getHttpServer()).post('/user').send({
        email: 'test@gmail.com',
        password: '1234',
        username: 'test',
      });

      expect(res.statusCode).toBe(201);
      console.log(res.body);
    });
  });
});
