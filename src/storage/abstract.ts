export enum StorageType {
  JSON_FILE = 'jsonFile',
}

abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserPasswordHash(user: string): Promise<string | undefined>;
  abstract upsertUserPasswordHash(user: string, passwordHash: string): Promise<void>;

  abstract getUserAndCsrfokenBySessionId(sessionId: string): Promise<{ user?: string; csrfToken?: string }>;
  abstract upsertUserSessionId(user: string, sessionId: string): Promise<void>;
  abstract upsertUserCsrfToken(user: string, csrfToken: string): Promise<void>;
  abstract deleteUserSessionId(user: string): Promise<void>;
}

export default AbstractStorage;
