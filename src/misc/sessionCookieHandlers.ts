import cookie from 'cookie';
import { LoginOrRegisterRequest, Response } from '../misc/requestAndResponseTypes';
import config from '../config';

export function getSessionIdFromCookie(req: LoginOrRegisterRequest): string | undefined {
  const cookies = cookie.parse(req.headers.cookie || '') as { sessionId: string | undefined };
  return cookies.sessionId;
}

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
