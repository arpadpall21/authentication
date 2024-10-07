import cookie from 'cookie';
import generateUniqueId from 'generate-unique-id';
import config from '../config';

export function generateSessionCookieValue(): string {
  return cookie.serialize('session.id', generateUniqueId({ length: config.authentication.sessionCookie.idLength }), {
    httpOnly: config.authentication.sessionCookie.httpOnly,
    maxAge: config.authentication.sessionCookie.maxAge,
    sameSite: config.authentication.sessionCookie.sameSite,
    secure: config.authentication.sessionCookie.secure,
  });
}
