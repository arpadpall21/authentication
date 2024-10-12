export enum StorageType {
  FILE = 'file',
}

abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserPasswordHash(user: string): Promise<string | undefined>;
  abstract upsertUserPasswordHash(user: string, passwordHash: string): Promise<void>;

  abstract getUserAndCsrfokenBySessionId(sessionId: string): Promise<{ user?: string; Csrfoken?: string }>;
  abstract upsertUserSessionId(user: string, sessionId: string): Promise<void>;
  abstract upsertUserCsrfoken(user: string, csrfToken: string): Promise<void>;
  abstract deleteUserSessionId(user: string): Promise<void>;
}

export default AbstractStorage;
