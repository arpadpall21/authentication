import fs from 'node:fs';
import objectMerge from 'object-merge';

interface Config {
  server: {
    host: string;
    port: number;
  };
  authentication: {
    user: {
      minLength: number;
      maxLength: number;
    };
    password: {
      minLength: number;
      maxLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requiredMinDigits: number;
      allowSpaces: boolean;
      blacklist: string[];
    };
  };
}

const defaultConfig: Config = {
  server: {
    host: 'localhost',
    port: 3000,
  },
  authentication: {
    user: {
      minLength: 8,
      maxLength: 45,
    },
    password: {
      minLength: 8,
      maxLength: 45,
      requireUppercase: false,
      requireLowercase: false,
      requiredMinDigits: 0,
      allowSpaces: true,
      blacklist: [],
    },
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
