import * as express from 'express';
import { Cat, CatType } from './app.model';

const app: express.Express = express();
const port: number = 8000;

// middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.url, req.rawHeaders[1]);
    console.log('this is logging middleware');
    next();
});

app.get('/cats/som', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('this is som middleware');
    next();
});

app.get('/cats', (req: express.Request, res: express.Response) => {
    // console.log(req.url, req.rawHeaders[1]);
    res.json({
        cats: Cat,
    });
});

app.get('/cats/blue', (req: express.Request, res: express.Response) => {
    // console.log(req.url, req.rawHeaders[1]);
    res.json({
        blue: Cat[0],
    });
});

app.get('/cats/som', (req: express.Request, res: express.Response) => {
    // console.log(req.url, req.rawHeaders[1]);
    res.json({
        som: Cat[1],
    });
});

// 404 error middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('this is error middleware');
    res.status(404).send({
        error: '404 Not Found Error',
    });
});

app.listen(port, () => {
    console.log(`app listening on port #${port}`);
});
