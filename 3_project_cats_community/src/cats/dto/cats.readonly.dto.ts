import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cat } from '../schema/cats.schema';

/*
    type 또는 interface를 사용하지 않고 class로 typing을 하는 이유
    * 데코레이터 패턴 적용 가능
    * 상속을 통한 재사용성 증가 가능 
*/
// PickType을 사용해 Cat 클래스에서 원하는 타입만 가져올 수 있다.
export class ReadOnlyCatDto extends PickType(Cat, ['email', 'name'] as const) {
    @ApiProperty({
        example: '63d007c105921237748a2e21',
        description: 'id',
    })
    id: string;
}
