import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport'; // 사용할 Strategy 기본 설정
import { JwtModule } from '@nestjs/jwt'; // 로그인 할 때 사용할 전략 -> JWT
import { JwtStrategy } from './jwt/jwt.strategy';
// import { CatsRepository } from 'src/cats/cats.repository';
import { CatsModule } from 'src/cats/cats.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        forwardRef(() => CatsModule),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
