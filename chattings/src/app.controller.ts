import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    @Render('index') // main.ts 파일에서 지정한 ViewsDir 안에서 찾아서 렌더링
    root() {
        return { data: { title: 'Chattings', copyright: 'bitkunst' } };
    }
}
