import fs, { promises as fsPromises } from 'node:fs';
import AbstractStorage from './abstract';
import config from '../config';

const fileStoragePath = config.storage.file.path;

interface Storage {
  users: {
    [key: string]: {
      passwordHash?: string;
      sessionId?: string;
    };
  };
}

class FileStorage extends AbstractStorage {
  constructor() {
    super();

    try {
      const result = fs.readFileSync(fileStoragePath);
      const resultObj = JSON.parse(result.toString());

      if (!resultObj.users || typeof resultObj.users !== 'object') {
        throw Error('Invalid storage format');
      }

      console.info(`File used for file storage: ${fileStoragePath}`);
    } catch (err) {
      throw err;
    }
  }

  async getUserPasswordHash(user: string): Promise<string | undefined> {
    try {
      const fileStorage = await this.readFileStorage();
      console.info(`Getting password hash for user: ${user}`);

      if (fileStorage.users[user]) {
        return fileStorage.users[user].passwordHash;
      } else {
        return undefined;
      }
    } catch (err) {
      console.error(`Failed to get user hash for user: ${user}`, err);
      throw err;
    }
  }

  async upsertUserPasswordHash(user: string, passwordHash: string): Promise<void> {
    try {
      const fileStorage = await this.readFileStorage();

      if (fileStorage.users[user]) {
        fileStorage.users[user].passwordHash = passwordHash;
      } else {
        fileStorage.users[user] = { passwordHash };
      }

      await this.writeFileStorage(fileStorage);
      console.info(`Upserting user paswrod hash for user: ${user}`);
      return;
    } catch (err) {
      console.error(`Failed to upser pasword hash for user: ${user}`, err);
      throw err;
    }
  }

  async getUserAndCsrfokenBySessionId(sessionId: string): Promise<{ user?: string; Csrfoken?: string }> {
    try {
      const fileStorage = await this.readFileStorage();

      for (const user in fileStorage.users) {
        if (fileStorage.users[user].sessionId === sessionId) {
          console.info(`Getting user by session id: ${user}`);
          return { user };
        }
      }

      return {};
    } catch (err) {
      console.error('Failed to get user by session id');
      throw err;
    }
  }

  async upsertUserSessionId(user: string, sessionId: string): Promise<void> {
    try {
      const fileStorage = await this.readFileStorage();

      if (fileStorage.users[user]) {
        fileStorage.users[user].sessionId = sessionId;
      } else {
        fileStorage.users[user] = { sessionId };
      }

      await this.writeFileStorage(fileStorage);
      console.info(`Upserting session id for user: ${user}`);
      return;
    } catch (err) {
      console.error(`Failed to upser session id for user: ${user}`, err);
      throw err;
    }
  }

  async upsertUserCsrfoken(user: string, csrTfoken: string): Promise<void> {

  }






  async deleteUserSessionId(sessionId: string): Promise<string | false> {
    try {
      const fileStorage = await this.readFileStorage();

      for (const user in fileStorage.users) {
        if (fileStorage.users[user].sessionId === sessionId) {
          delete fileStorage.users[user].sessionId;
          await this.writeFileStorage(fileStorage);

          console.info(`Session id deleted for user: ${user}`);
          return user;
        }
      }

      return false;
    } catch (err) {
      console.error('Failed to delete session id', err);
      throw err;
    }
  }

  private async readFileStorage(): Promise<Storage> {
    const result = await fsPromises.readFile(fileStoragePath);
    return JSON.parse(result.toString());
  }

  private async writeFileStorage(storage: object): Promise<void> {
    await fsPromises.writeFile(fileStoragePath, JSON.stringify(storage));
  }
}

export default FileStorage;
