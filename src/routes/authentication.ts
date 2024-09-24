import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validatePassword } from '../misc/passwordHandlers';

interface LoginOrRegisterRequest {
  user: string;
  password: string;
}

interface AuthSuccessResponse {}

interface AuthErrorResponse {
  userError?: string;
  passwordError?: string[];
}

const authRouter = Router();

authRouter.post('/register', (req: Request<object, object, LoginOrRegisterRequest>, res: Response<AuthSuccessResponse | AuthErrorResponse>) => {
  console.log(req.body)

  validatePassword('test')
  
  res.send({ success: true, message: [] });
});

authRouter.post('/login', (req: Request<object, object, LoginOrRegisterRequest>, res: Response<AuthSuccessResponse | AuthErrorResponse>) => {

  res.send({ success: true, message: [] });
});

authRouter.get('/logout', (req: Request, res: Response<AuthSuccessResponse | AuthErrorResponse>) => {


  res.send({ success: true, message: [] });
});

export default authRouter;
