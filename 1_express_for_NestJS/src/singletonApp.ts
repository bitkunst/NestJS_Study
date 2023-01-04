import * as express from 'express';
import catsRouter from './cats/cats.route';

class Server {
    public app: express.Application;
    public port: number;

    constructor(_port: number) {
        const app: express.Application = express();
        this.app = app;
        this.port = _port;
    }

    private setRoute() {
        //* router
        this.app.use(catsRouter);
    }

    private setMiddleware() {
        //* logging middleware
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.headers['user-agent']);
            console.log('this is logging middleware');
            next();
        });

        //* JSON middleware
        this.app.use(express.json());

        this.setRoute();

        //* 404 error middleware
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('this is error middleware');
            res.status(404).json({
                error: '404 Not Found error',
            });
        });
    }

    public listen() {
        this.setMiddleware();
        this.app.listen(this.port, () => {
            console.log(`app listening on port #${this.port}`);
        });
    }
}

function init(_port: number) {
    const server = new Server(_port);
    server.listen();
}

init(4000);
