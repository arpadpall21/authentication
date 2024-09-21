import { Router, Request, Response } from 'express';

const authRouter = Router();

authRouter.post('/register', (req: Request, res: Response) => {
  res.send('REGISTER OK');
});

authRouter.post('/login', (req: Request, res: Response) => {
  res.send('LOGIN OK');
});

authRouter.get('/logout', (req: Request, res: Response) => {
  res.send('LOGOUT OK');
});

export default authRouter;
