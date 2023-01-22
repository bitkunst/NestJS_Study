import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
    hiCatServiceProduct() {
        return 'hi cat!!';
    }
}
