import fs from 'node:fs';
import objectMerge from 'object-merge';
import { StorageType } from './storage/abstract';

interface Config {
  server: {
    host: string;
    port: number;
  };
  authentication: {
    user: {
      minLength: number;
      maxLength: number;
      blacklist?: string[];
      whitelist?: string[];
    };
    password: {
      minLength: number;
      maxLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requiredMinDigits: number;
      allowSpaces: boolean;
      blacklist: string[];
      saltRounds: number;
      timingAttackProtectionMs: number;
    };
    sessionCookie: {
      httpOnly: boolean;
      maxAge: number;
      sameSite: boolean | 'strict' | 'lax' | 'none';
      secure: boolean;
      idLength: number;
    };
    csrfTokenLength: number;
  };
  storage: {
    use: StorageType;
    jsonFile: {
      path: string;
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
      blacklist: undefined, // array that accepts regex members
      whitelist: undefined,
    },
    password: {
      minLength: 8,
      maxLength: 45, // max 70
      requireUppercase: false,
      requireLowercase: false,
      requiredMinDigits: 0,
      allowSpaces: true,
      blacklist: [],
      saltRounds: 10, // recommended range 8-15
      timingAttackProtectionMs: 500,
    },
    sessionCookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 1 week
      sameSite: true,
      secure: false, // when true requires HTTPS
      idLength: 32,
    },
    csrfTokenLength: 32,
  },
  storage: {
    use: StorageType.JSON_FILE,
    jsonFile: {
      path: '',
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
