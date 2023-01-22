import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
    imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URI), CatsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    private readonly isDev: boolean = process.env.NODE_ENV === 'dev' ? true : false;
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        mongoose.set('debug', this.isDev); // mongoose 쿼리 logger
    }
}
