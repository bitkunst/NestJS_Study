import * as express from 'express';
import { Cat, CatType } from './app.model';

const app: express.Express = express();
const port: number = 8000;

app.get('/test', (req: express.Request, res: express.Response) => {
    res.json({
        cats: Cat,
    });
});

app.listen(port, () => {
    console.log(`app listening on port #${port}`);
});
