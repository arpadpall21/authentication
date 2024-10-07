import { Router, Request, Response } from 'express';
import { validateUserAndPassword, hashPassword, comparePassword } from '../misc/authHandlers';
import { generateSessionCookieValue, deleteSessionCookieValue } from '../misc/userSession';
import storage from '../storage';
import config from '../config';

interface LoginOrRegisterRequest {
  user?: string;
  password?: string;
}

export interface AuthErrorResponse {
  userError?: string[];
  passwordError?: string[];
}

const authRouter = Router();

authRouter.post(
  '/register',
  async (req: Request<object, object, LoginOrRegisterRequest>, res: Response<undefined | AuthErrorResponse>) => {
    console.log('------------------------')
    console.log( generateSessionCookieValue() )
    console.log( deleteSessionCookieValue() )
  
  
  
  
    try {
      const userAndPasswordValidationResult = validateUserAndPassword(req.body.user, req.body.password);
      if (!userAndPasswordValidationResult.ok) {
        res.statusCode = 422;
        res.send(userAndPasswordValidationResult.errorResponse);
        return;
      }

      if (
        config.authentication.user.blacklist &&
        config.authentication.user.blacklist.some((blacklistedUser) => {
          if (req.body.user && RegExp(blacklistedUser).test(req.body.user)) {
            return true;
          }
        })
      ) {
        res.statusCode = 401;
        res.send({ userError: ['User blacklisted'] });
        return;
      }

      if (config.authentication.user.whitelist && !config.authentication.user.whitelist.includes(req.body.user || '')) {
        res.statusCode = 401;
        res.send({ userError: ['User not whitelisted'] });
        return;
      }

      if (await storage.getUserPasswordHash(req.body.user)) {
        res.statusCode = 409;
        res.send({ userError: ['User already exists'] });
        return;
      }

      const hashedPassword = await hashPassword(req.body.password);
      await storage.upsertUserHash(req.body.user, hashedPassword);
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
      const userAndPasswordValidationResult = validateUserAndPassword(req.body.user, req.body.password);
      if (!userAndPasswordValidationResult.ok) {
        res.statusCode = 422;
        res.send(userAndPasswordValidationResult.errorResponse);
        return;
      }

      const passwordHash = await storage.getUserPasswordHash(req.body.user);
      const authResult = await comparePassword(req.body.password, passwordHash);
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
