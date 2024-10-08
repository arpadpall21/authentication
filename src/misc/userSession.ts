import { Request, Response } from 'express';
import cookie from 'cookie';
import config from '../config';

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
