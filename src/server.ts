import express from 'express';
import authRouter from './routes/auth';
import appRouter from './routes/app';

const app = express();
const port = 3000;
const host = 'http://localhost';

app.use('/', express.json());

app.use('/', authRouter);
app.use('/', appRouter);

app.listen(port, () => {
  console.warn(`Express is listening on ${host}:${port}`);
});
