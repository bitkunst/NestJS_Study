import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe()); // class-validator 등록
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('C.I.C')
        .setDescription('Cat Information Community')
        .setVersion('1.0.0')
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // end-point : api-docs

    // CORS 설정
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const PORT = process.env.PORT;
    await app.listen(PORT);
}
bootstrap();
