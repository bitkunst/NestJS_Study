import * as express from 'express';
import catsRouter from './cats/cats.route';

const app: express.Express = express();
const port: number = 8000;

//* logging middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.rawHeaders[1]);
    console.log('this is logging middleware');
    next();
});

//* JSON middleware
app.use(express.json());

//* router
app.use(catsRouter);

//* 404 error middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('this is error middleware');
    res.status(404).json({
        error: '404 Not Found error',
    });
});

app.listen(port, () => {
    console.log(`app listening on port #${port}`);
});
