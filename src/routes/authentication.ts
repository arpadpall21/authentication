import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import passwordValidator from 'password-validator';

interface LoginOrRegisterBody {
  user: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

const authRouter = Router();

authRouter.post('/register', (req: Request<object, object, LoginOrRegisterBody>, res: Response<AuthResponse>) => {
  console.log(req.body)

  
  
  res.send({ success: true });
});

authRouter.post('/login', (req: Request<object, object, LoginOrRegisterBody>, res: Response<AuthResponse>) => {

  res.send({ success: true });
});

authRouter.get('/logout', (req: Request, res: Response<AuthResponse>) => {


  res.send({ success: true });
});

export default authRouter;
