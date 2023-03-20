import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return 'TypeORM in NestJS, Just coding,,';
  }
}
