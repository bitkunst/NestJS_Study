import {
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    UseFilters,
    UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { PositiveIntPipe } from 'src/common/pipes/positiveInt.pipe';
import { CatsService } from './cats.service';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter) // 에러 발생시 Exception Filter를 거쳐서 에러 반환
export class CatsController {
    // Service 의존성 주입(DI)
    // catsController라는 소비자가 catsService라는 제품을 주입받은 것
    constructor(private readonly catsService: CatsService) {}

    // cats/
    @Get()
    getAllCat() {
        console.log('hello controller');
        return { cats: 'get all cat api' };
    }

    // cats/:id
    @Get(':id')
    getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) param: number) {
        return 'get one cat api';
    }

    @Post()
    createCat() {
        return 'create cat';
    }

    @Put(':id')
    updateCat() {
        return 'update cat';
    }

    @Patch(':id')
    updatePartialCat() {
        return 'update';
    }

    @Delete(':id')
    deleteCat() {
        return 'delete cat';
    }
}
