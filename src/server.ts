import express from 'express';
import config from './config';
import authRouter from './routes/authentication';
import appRouter from './routes/app';

console.info('Server initialized with config:', config);

const app = express();
const host = config.server.host;
const port = config.server.port;

app.use(express.json());

app.use('/', authRouter);
app.use('/', appRouter);

app.listen(port, () => {
  console.warn(`Express is listening on: ${host}:${port}`);
});
