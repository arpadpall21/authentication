import fs from 'node:fs';
import objectMerge from 'object-merge';

interface Config {
  server: {
    host: string;
    port: number;
  };
}

const defaultConfig: Config = {
  server: {
    host: 'localhost',
    port: 3000,
  },
};
let config: Config;

try {
  const customConfig: Config = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
  config = objectMerge(defaultConfig, customConfig) as Config;
} catch (err) {
  console.error('Failed to parse config/config.json');
  throw err;
}

export default config;
