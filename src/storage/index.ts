import AbstractStorage, { StorageType } from './abstract';
import config from '../config';
import JSONFileStorage from './jsonFileStorage';
// implement other storages here...

let storage;

switch (config.storage.use) {
  case StorageType.JSON_FILE: {
    storage = new JSONFileStorage();
    console.info(`Storage used: ${StorageType.JSON_FILE}`);
    break;
  }
  default: {
    throw Error('Invalid strorage type configured');
  }
}

export default storage as AbstractStorage;
