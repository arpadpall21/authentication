export enum StorageType {
  FILE = 'file',
}

abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserPasswordHash(user?: string): Promise<string | undefined>;
  abstract upsertUserPasswordHash(user?: string, hash?: string): Promise<boolean>;

  abstract getUserSessionId(user: string): Promise<string | null>;
  abstract upsertUserSessionId(user: string, sessionId: string): Promise<boolean>;
  abstract deleteUserSessionId(user: string): Promise<boolean>;
}

export default AbstractStorage;
