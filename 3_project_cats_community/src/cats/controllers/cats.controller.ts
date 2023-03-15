import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    UploadedFiles,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { multerOptions } from 'src/common/utils/multer.options';
import { CatsService } from '../services/cats.service';
import { ReadOnlyCatDto } from '../dto/cats.readonly.dto';
import { CatRequestDto } from '../dto/cats.request.dto';
import { Cat } from '../schema/cats.schema';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(private readonly catsService: CatsService, private readonly authService: AuthService) {}

    @ApiOperation({ summary: '현재 고양이 가져오기' })
    @UseGuards(JwtAuthGuard) // JWT Guard 사용 -> Guard에서 인증 처리를 해줌 -> 인증 처리된 정보를 request 객체에 전달
    @Get()
    getCurrentCat(@CurrentUser() cat: Cat) {
        return cat.readOnlyData;
    }
    // getCurrentCat(@Req() req: Request) {
    //     return req.user;
    // }

    @ApiResponse({
        status: 500,
        description: 'Internal Server Error...',
    })
    @ApiResponse({
        status: 201,
        description: '회원가입 성공',
        type: ReadOnlyCatDto,
    })
    @ApiOperation({ summary: '회원가입' })
    @Post()
    async signUp(@Body() body: CatRequestDto) {
        return await this.catsService.signUp(body);
    }

    @ApiOperation({ summary: '로그인' })
    @HttpCode(200)
    @Post('login')
    logIn(@Body() data: LoginRequestDto) {
        return this.authService.jwtLogin(data);
    }

    // 불필요 -> 프론트엔드에서 JWT 자체를 제거해버리면 그 자체로 로그아웃이 된 것.
    // @ApiOperation({ summary: '로그아웃' })
    // @Post('logout')
    // logOut() {
    //     return 'logout';
    // }

    @ApiOperation({ summary: '고양이 이미지 업로드' })
    // @UseInterceptors(FileInterceptor('image')) // 단일 파일 업로드
    @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats'))) // 파일 배열 업로드
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    uploadCatImg(@UploadedFiles() files: Array<Express.Multer.File>, @CurrentUser() cat: Cat) {
        // console.log(files);
        // return { image: `http://localhost:4000/media/cats/${files[0].filename}` };
        return this.catsService.uploadImg(cat, files);
    }
}
