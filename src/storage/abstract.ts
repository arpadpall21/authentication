export enum StorageType {
  FILE = 'file',
}

abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserHash(user: string): Promise<string | undefined>;

  abstract upsertUserHash(user: string, hash: string): Promise<boolean>;
}

export default AbstractStorage;
