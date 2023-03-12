import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly catsRepository: CatsRepository, private jwtService: JwtService) {}

    async jwtLogin(data: LoginRequestDto) {
        const { email, password } = data;

        //todo: 해당하는 email이 있는지 체크
        const cat = await this.catsRepository.findCatByEmail(email);
        if (!cat) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }

        //todo: password 일치 여부 체크
        const isPasswordValidated: boolean = await bcrypt.compare(password, cat.password);
        // password가 hashing 되어 있기 때문에 bcrypt에서 제공해주는 compare() 메소드를 사용해서 비교
        if (!isPasswordValidated) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }

        //todo: 유효성 검사가 끝났다면 jwt를 클라이언트에 전달
        // @nestjs/jwt에 존재하는 JwtService 사용
        // AuthModule에서 import 한 JwtModule 안에서 제공해주는 공급자인 JwtService 사용
        const payload = { email: email, sub: cat.id }; // sub는 토큰 제목을 의미 (subject)
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
        });

        return { token };
    }
}
