export enum StorageType {
  FILE = 'file',
}

abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserPasswordHash(user?: string): Promise<string | undefined>;
  abstract upsertUserPasswordHash(user?: string, hash?: string): Promise<void>;

  abstract getUserSessionId(user: string): Promise<string | undefined>;
  abstract upsertUserSessionId(user: string, sessionId: string): Promise<void>;
  abstract deleteUserSessionId(user: string): Promise<void>;
}

export default AbstractStorage;
