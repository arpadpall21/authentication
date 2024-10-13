import { NextFunction } from 'express';
import { Request, Response } from '../types/requestResponseTypes';
import { getSessionIdFromCookie } from './sessionCookieHandlers';
import storage from '../../storage';

export async function verifySessionToken(req: Request, res: Response, next: NextFunction) {
  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) {
    console.info(
      `Unauthorized request: (host=${req.hostname}) (port=${req.socket.remotePort}) (sessionId=${sessionId || ''})`,
    );
    res.sendStatus(401);
    return;
  }

  const { user } = await storage.getUserAndCsrfokenBySessionId(sessionId || '');
  if (!user) {
    console.info(
      `Unauthorized request: (host=${req.hostname}) (port=${req.socket.remotePort}) (sessionId=${sessionId || ''})`,
    );
    res.sendStatus(401);
    return;
  }

  req.user = user;
  next();
}

export async function verifySessionAndCsrfTokens(req: Request, res: Response, next: NextFunction) {
  const sessionId = getSessionIdFromCookie(req);
  const reqCsrfToken = req.get('X-CSRF-Token');
  if (!sessionId || !reqCsrfToken) {
    console.info(
      `Unauthorized request: (host=${req.hostname}) (port=${req.socket.remotePort})` +
        ` (sessionId=${sessionId || ''}) (csrfToken=${req.get('X-CSRF-Token')})`,
    );
    res.sendStatus(401);
    return;
  }

  const { user, csrfToken } = await storage.getUserAndCsrfokenBySessionId(sessionId);
  if (!user || csrfToken !== reqCsrfToken) {
    console.info(
      `Unauthorized request: (host=${req.hostname}) (port=${req.socket.remotePort})` +
        ` (sessionId=${sessionId || ''}) (csrfToken=${req.get('X-CSRF-Token')})`,
    );
    res.sendStatus(401);
    return;
  }

  req.user = user;
  next();
}
