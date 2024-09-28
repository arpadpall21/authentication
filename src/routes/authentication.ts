import { Router, Request, Response } from 'express';
import { validateUser, validatePassword, hashPassword, comparePassword } from '../misc/authHandlers';
import storage from '../storage';

interface LoginOrRegisterRequest {
  user?: string;
  password?: string;
}

interface AuthErrorResponse {
  userError?: string[];
  passwordError?: string[];
}

const authRouter = Router();

authRouter.post(
  '/register',
  async (req: Request<object, object, LoginOrRegisterRequest>, res: Response<undefined | AuthErrorResponse>) => {
    try {
      const userValidationResult = validateUser(req.body.user);                     // NOTE: password & username logic is the same as in the /login endpoint (maybe simplify it later on to make the code DRY)
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

      const hashedPassword = await hashPassword(req.body.password || '')
      await storage.upsertUserHash(req.body.user || '', hashedPassword);
      console.info(`User registered: ${req.body.user}`);
      res.sendStatus(200);
    } catch (err) {
      console.error('Endpoint error: /register', err);
      res.sendStatus(500);
    }
  },
);

authRouter.post(
  '/login',
  async (req: Request<object, object, LoginOrRegisterRequest>, res: Response<undefined | AuthErrorResponse>) => {
    try {
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

      const passwordHash = await storage.getUserPasswordHash(req.body.user || '');
      const authResult = await comparePassword(req.body.password || '', passwordHash || '');
      if (!authResult) {
        res.sendStatus(401);
        return;
      }

      console.info(`User loggin: ${req.body.user}`);
      res.sendStatus(200);
    } catch (err) {
      console.error('Endpoint error: /login', err);
      res.sendStatus(500);
    }
  },
);

authRouter.get('/logout', (req: Request, res: Response) => {

  res.send({ success: true, message: [] });
});

export default authRouter;
