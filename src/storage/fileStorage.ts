import fs, { promises as fsPromises } from 'node:fs';
import AbstractStorage from './abstract';
import config from '../config';

const fileStoragePath = config.storage.file.path;

class FileStorage extends AbstractStorage {
  constructor() {
    super();

    try {
      const result = fs.readFileSync(fileStoragePath);
      JSON.parse(result.toString());
      console.info(`File used for file storage: ${fileStoragePath}`);
    } catch {
      throw Error('Invalid file configured for file storage');
    }
  }

  async getUserPasswordHash(user?: string): Promise<string | undefined> {
    if (!user) {
      console.error('Failed to get user hash, no user provided');
      return;
    }

    try {
      const fileStorage = await this.readFileStorage();

      console.info(`Getting password hash for user: ${user}`);
      return fileStorage[user];
    } catch (err) {
      console.error(`Failed to get user hash for user: ${user}`, err);
    }
  }

  async upsertUserPasswordHash(user?: string, hash?: string): Promise<void> {
    if (!user || !hash) {
      console.error('Failed to upser user hash, no user or hash provided');
      return;
    }

    try {
      const fileStorage = await this.readFileStorage();
      fileStorage[user] = hash;
      await this.writeFileStorage(fileStorage);

      console.info(`Upserting user paswrod hash [user: ${user}]`);
      return;
    } catch (err) {
      console.error(`Failed to upser pasword hash for user: ${user}`, err);
    }
  }

  async getUserSessionId(user: string): Promise<string | undefined> {
    return;
  }

  async upsertUserSessionId(user: string, sessionId: string): Promise<void> {
    return;
  }

  async deleteUserSessionId(user: string): Promise<void> {
    return;
  }

  private async readFileStorage(): Promise<{ [key: string]: string }> {
    const result = await fsPromises.readFile(fileStoragePath);
    return JSON.parse(result.toString());
  }

  private async writeFileStorage(storage: object): Promise<boolean> {
    await fsPromises.writeFile(fileStoragePath, JSON.stringify(storage));
    return true;
  }
}

export default FileStorage;
