import AbstractStorage, { StorageType } from './abstract';
import config from '../config';
import FileStorage from './fileStorage';
// implement other storages here...

let storage;

switch (config.storage.type) {
  case StorageType.FILE: {
    storage = new FileStorage();
    console.info(`Storage used: ${StorageType.FILE}`);
    break;
  }
  default: {
    throw Error('Invalid strorage type configured');
  }
}

export default storage as AbstractStorage;
