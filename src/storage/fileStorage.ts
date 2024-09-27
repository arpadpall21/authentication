import AbstractStorage from './abstract';

class FileStorage extends AbstractStorage{

  async getUserHash(user: string): Promise<string> {
    return '';
  }

  async setUserHash(user: string, hash: string): Promise<boolean> {
    return true;
  }
}

export default FileStorage;
