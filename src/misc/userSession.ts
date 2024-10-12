import crypto from 'node:crypto';
import cookie from 'cookie';
import { NextFunction } from 'express';
import { Request, LoginOrRegisterRequest, Response } from '../misc/requestAndResponseTypes';
import config from '../config';
import storage from '../storage';

export function setSessionIdCookie(res: Response, sessionId: string): void {
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

export function deleteSessionIdCookie(res: Response): void {
  res.setHeader('Set-Cookie', cookie.serialize('sessionId', 'deleted', { expires: new Date(0) }));
}

export function getSessionIdFromCookie(req: LoginOrRegisterRequest): string | undefined {
  const cookies = cookie.parse(req.headers.cookie || '') as { sessionId: string | undefined };
  return cookies.sessionId;
}

export async function verifySessionToken(req: Request, res: Response, next: NextFunction) {
  const sessionId = getSessionIdFromCookie(req);
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

export function generateSecureToken(length: number): string {
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('base64').slice(0, length);
}
