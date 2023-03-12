import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// AuthGuard에는 Strategy를 자동으로 실행해주는 기능이 있다.
// 실행 순서 : JWT Guard -> JWT Strategy

// AuthGuard를 주입 받게 되면 JwtStrategy의 validate 함수가 실행
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
