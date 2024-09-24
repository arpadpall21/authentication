import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validatePassword } from '../misc/passwordHandlers';

interface LoginOrRegisterRequestBody {
  user: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

const authRouter = Router();

authRouter.post('/register', (req: Request<object, object, LoginOrRegisterRequestBody>, res: Response<AuthResponse>) => {
  console.log(req.body)

  validatePassword('test')
  
  res.send({ success: true });
});

authRouter.post('/login', (req: Request<object, object, LoginOrRegisterRequestBody>, res: Response<AuthResponse>) => {

  res.send({ success: true });
});

authRouter.get('/logout', (req: Request, res: Response<AuthResponse>) => {


  res.send({ success: true });
});

export default authRouter;
