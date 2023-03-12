import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { CatsRepository } from 'src/cats/cats.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly catsRepository: CatsRepository) {
        // super 안의 옵션은 JWT에 대한 설정값
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false, // 만료기간 무시 X
        });
    }

    // payload에 대한 유효성 검사
    // 함수명은 반드시 validate
    async validate(payload: Payload) {
        const cat = await this.catsRepository.findCatByIdWithoutPassword(payload.sub);

        if (cat) {
            return cat; // return 한 값이 request.user 안에 들어가게 된다.
        } else {
            throw new UnauthorizedException('접근 오류');
        }
    }
}
