import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    // NestJS에서는 로깅을 할 때 Logger 클래스 사용
    private logger = new Logger();

    use(req: Request, res: Response, next: NextFunction) {
        res.on('finish', () => {
            this.logger.log(`${req.ip} ${req.method} ${res.statusCode}`, req.originalUrl);
        });
        next();
    }
}
