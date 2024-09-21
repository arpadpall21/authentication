import fs from 'node:fs';

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
  const customConfig = JSON.parse(fs.readFileSync('./config/config.json', 'utf-8'));
  config = Object.assign(defaultConfig, customConfig);
} catch (err) {
  console.error('Failed to parse config/config.json');
  throw err;
}

export default config;
