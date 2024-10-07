import cookie from 'cookie';
import config from '../config';

export function generateSessionCookieValue(sessionId: string): string {
  return cookie.serialize('session.id', sessionId, {
    httpOnly: config.authentication.sessionCookie.httpOnly,
    maxAge: config.authentication.sessionCookie.maxAge,
    sameSite: config.authentication.sessionCookie.sameSite,
    secure: config.authentication.sessionCookie.secure,
  });
}

export function deleteSessionCookieValue(): string {
  return cookie.serialize('session.id', 'deleted', { expires: new Date(0) });
}
