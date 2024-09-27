abstract class AbstractStorage {
  // instance = one db connection

  abstract getUserHash(user: string): Promise<string>;

  abstract setUserHash(user: string, hash: string): Promise<boolean>;
}

export default AbstractStorage;
