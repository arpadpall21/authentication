import { Router } from 'express';
import { validateUserAndPassword, hashPassword, comparePassword } from '../misc/authHandlers';
import {
  verifySessionToken,
  setSessionIdCookie,
  deleteSessionIdCookie,
  generateSecureToken,
} from '../misc/userSession';
import { Request, LoginOrRegisterRequest, AuthResponse, CsrfResponse } from '../misc/requestAndResponseTypes';
import storage from '../storage';
import config from '../config';

const authRouter = Router();

authRouter.post('/register', async (req: LoginOrRegisterRequest, res: AuthResponse) => {
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

    const passwordHash = await hashPassword(req.body.password as string);
    await storage.upsertUserPasswordHash(req.body.user as string, passwordHash);
    console.info(`User registered: ${req.body.user}`);
    res.status(200).send({ message: 'user successfully registered' });
  } catch (err) {
    console.error('Endpoint error: /register', err);
    res.sendStatus(500);
  }
});

authRouter.post('/login', async (req: LoginOrRegisterRequest, res: AuthResponse) => {
  try {
    const userAndPasswordValidationResult = validateUserAndPassword(req.body.user, req.body.password);
    if (!userAndPasswordValidationResult.ok) {
      res.status(422).send(userAndPasswordValidationResult.errorResponse);
      return;
    }

    const passwordHash = await storage.getUserPasswordHash(req.body.user as string);
    const authResult = await comparePassword(req.body.password as string, passwordHash || '');
    if (!authResult) {
      res.sendStatus(401);
      return;
    }

    const sessionId = generateSecureToken(config.authentication.sessionCookie.idLength);
    await storage.upsertUserSessionId(req.body.user as string, sessionId);
    setSessionIdCookie(res, sessionId);

    console.info(`User logged in: ${req.body.user}`);
    res.status(200).send({ message: 'user successfully logged in' });
  } catch (err) {
    console.error('Endpoint error: /login', err);
    res.sendStatus(500);
  }
});

authRouter.get('/logout', verifySessionToken, async (req: Request, res: AuthResponse) => {
  try {
    await storage.deleteUserSessionId(req.user || '');
    deleteSessionIdCookie(res);

    console.info(`User logged out user: ${req.user}`);
    res.status(200).send({ message: 'user successfully logged out' });
  } catch (err) {
    console.error('Endpoint error: /logout', err);
    res.sendStatus(500);
  }
});

authRouter.get('/csrf', verifySessionToken, async (req: Request, res: CsrfResponse) => {
  try {
    const csrfToken = generateSecureToken(config.authentication.csrfTokenLength);
    await storage.upsertUserCsrfToken(req.user as string, csrfToken);

    res.status(200).send({ csrfToken });
    console.info(`Csrf token sent to user: ${req.user}`);
  } catch (err) {
    console.error('Endpoint error: /csrf', err);
    res.sendStatus(500);
  }
});

export default authRouter;
