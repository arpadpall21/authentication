import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;
const host = 'http://localhost';

app.use('/', express.json());


app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});


// body annotation (NOT validation) -----------
interface CustomReqBody {
  id: number;
  user: string;
}
interface CustomResBody {
  id: number;
  user: string;
}

app.post('/test', (req: Request<object, object, CustomReqBody>, res: Response<CustomResBody>, next: NextFunction) => {
  res.send({ id: 1, user: 'Doe' });
});


// fallback
app.use('/', (req: Request, res: Response) => {
  res.send(`Unsupported route: ${req.path}`);
});

app.listen(port, () => {
  console.warn(`Express is listening on ${host}:${port}`);
});
