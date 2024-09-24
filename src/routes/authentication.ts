import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

interface LoginOrRegisterBody {
  user: string;
  password: string;
}

const authRouter = Router();

authRouter.post('/register', (req: Request<object, object, LoginOrRegisterBody>, res: Response) => {
  console.log(req.body)

  res.send('REGISTER OK');
});

authRouter.post('/login', (req: Request<object, object, LoginOrRegisterBody>, res: Response) => {
  res.send('LOGIN OK');
});

authRouter.get('/logout', (req: Request, res: Response) => {
  res.send('LOGOUT OK');
});

export default authRouter;
