import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validateUser, validatePassword } from '../misc/authHandlers';

interface LoginOrRegisterRequest {
  user?: string;
  password?: string;
}

interface AuthSuccessResponse {}

interface AuthErrorResponse {
  userError?: string[];
  passwordError?: string[];
}

const authRouter = Router();

authRouter.post(
  '/register',
  (req: Request<object, object, LoginOrRegisterRequest>, res: Response<AuthSuccessResponse | AuthErrorResponse>) => {
    const userValidationResult = validateUser(req.body.user);
    const passwordValidationResult = validatePassword(req.body.password);

    if (!userValidationResult.success || !passwordValidationResult.success) {
      const errorResponse: AuthErrorResponse = {};
      if (!userValidationResult.success) {
        errorResponse.userError = userValidationResult.message;
      }
      if (!passwordValidationResult.success) {
        errorResponse.passwordError = passwordValidationResult.message;
      }

      res.statusCode = 422;
      res.send(errorResponse);
      return;
    }

    res.send({});
  },
);

authRouter.post(
  '/login',
  (req: Request<object, object, LoginOrRegisterRequest>, res: Response<AuthSuccessResponse | AuthErrorResponse>) => {
    const userValidationResult = validateUser(req.body.user);
    const passwordValidationResult = validatePassword(req.body.password);

    if (!userValidationResult.success || !passwordValidationResult.success) {
      const errorResponse: AuthErrorResponse = {};
      if (!userValidationResult.success) {
        errorResponse.userError = userValidationResult.message;
      }
      if (!passwordValidationResult.success) {
        errorResponse.passwordError = passwordValidationResult.message;
      }

      res.statusCode = 422;
      res.send(errorResponse);
      return;
    }

    res.send({});
  },
);

authRouter.get('/logout', (req: Request, res: Response<AuthSuccessResponse | AuthErrorResponse>) => {

  res.send({ success: true, message: [] });
});

export default authRouter;
