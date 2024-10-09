import { Request, Response, NextFunction } from 'express';
import cookie from 'cookie';
import config from '../config';
import storage from '../storage';

export function setSessionCookie(res: Response, sessionId: string): void {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('sessionId', sessionId, {
      httpOnly: config.authentication.sessionCookie.httpOnly,
      maxAge: config.authentication.sessionCookie.maxAge,
      sameSite: config.authentication.sessionCookie.sameSite,
      secure: config.authentication.sessionCookie.secure,
    }),
  );
}

export function deleteSessionCookie(res: Response): void {
  res.setHeader('Set-Cookie', cookie.serialize('sessionId', 'deleted', { expires: new Date(0) }));
}

export function getSessionIdFromCookie(req: Request): string | undefined {
  const cookies = cookie.parse(req.headers.cookie || '') as { sessionId: string | undefined };
  return cookies.sessionId;
}

export async function verifySessionToken(req: Request, res: Response, next: NextFunction) {
  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) {
    console.info(`Unauthorized request with session id: ${sessionId || ''}`);
    res.sendStatus(401);
    return;
  }

  const loggedInUser = await storage.getUserBySessionId(sessionId as string);
  if (!loggedInUser) {
    console.info(`Unauthorized request with session id: ${sessionId || ''}`);
    res.sendStatus(401);
    return;
  }

  next();
}
