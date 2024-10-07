import { Router, Request, Response } from 'express';
import generateUniqueId from 'generate-unique-id';
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
    try {
      const userAndPasswordValidationResult = validateUserAndPassword(req.body.user, req.body.password);
      if (!userAndPasswordValidationResult.ok) {
        res.status(422).send(userAndPasswordValidationResult.errorResponse);
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
        res.status(401).send({ userError: ['user blacklisted'] });
        return;
      }

      if (config.authentication.user.whitelist && !config.authentication.user.whitelist.includes(req.body.user || '')) {
        res.status(401).send({ userError: ['user not whitelisted'] });
        return;
      }

      if (await storage.getUserPasswordHash(req.body.user as string)) {
        res.status(409).send({ userError: ['user already exists'] });
        return;
      }

      const hashedPassword = await hashPassword(req.body.password as string);
      await storage.upsertUserPasswordHash(req.body.user as string, hashedPassword);
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
        res.status(422).send(userAndPasswordValidationResult.errorResponse);
        return;
      }

      const passwordHash = await storage.getUserPasswordHash(req.body.user as string);
      if (!passwordHash) {
        res.sendStatus(401);
        return;
      }

      const authResult = await comparePassword(req.body.password as string, passwordHash);
      if (!authResult) {
        res.sendStatus(401);
        return;
      }

      const sessionId = generateUniqueId({ length: config.authentication.sessionCookie.idLength });
      await storage.upsertUserSessionId(req.body.user as string, sessionId);



      console.info(`User loggin: ${req.body.user}`);
      res.sendStatus(200);
    } catch (err) {
      console.error('Endpoint error: /login', err);
      res.sendStatus(500);
    }
  },
);

authRouter.get('/logout', (req: Request, res: Response) => {

  res.status(200).send({ success: true, message: [] });
});

export default authRouter;
