import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

// ---------------------------
// Requests
// ---------------------------
export interface Request extends ExpressRequest {
  user?: string;
}

interface LoginOrRegisterRequestBody {
  user?: string;
  password?: string;
}
export interface LoginOrRegisterRequest extends ExpressRequest<object, object, LoginOrRegisterRequestBody> {}

// ---------------------------
// Responses
// ---------------------------
export interface Response extends ExpressResponse {}

export interface AuthResponseBody {
  message?: string;
  userError?: string[];
  passwordError?: string[];
}
export interface AuthResponse extends ExpressResponse<AuthResponseBody> {}

interface CsrfResponseBody {
  csrfToken: string;
}
export interface CsrfResponse extends ExpressResponse<CsrfResponseBody> {}
