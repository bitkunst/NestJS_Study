import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/*
    type 또는 interface를 사용하지 않고 class로 typing을 하는 이유
    * 데코레이터 패턴 적용 가능
    * 상속을 통한 재사용성 증가 가능 
*/
export class CatRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
