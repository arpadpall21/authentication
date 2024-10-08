export enum StorageType {
  FILE = 'file',
}

abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserPasswordHash(user: string): Promise<string | undefined>;
  abstract upsertUserPasswordHash(user: string, passwordHash: string): Promise<void>;

  abstract getUserBySessionId(sessionId: string): Promise<string | undefined>;
  abstract upsertUserSessionId(user: string, sessionId: string): Promise<void>;
  abstract deleteUserSessionId(sessionId: string): Promise<string | false>;
}

export default AbstractStorage;
