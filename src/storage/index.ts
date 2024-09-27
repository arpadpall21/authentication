import { StorageType } from './abstract';
import config from '../config';
import FileStorage from './fileStorage';
// implement other storages here...

let storage;

if (config.storage.type === StorageType.FILE) {
  storage = FileStorage;
  console.info('File storage selected');
}

if (!storage) {
  throw Error('No storage selected');
}

export default storage;


// TODO:
  // test if non accpeted storage passed in config.json
  