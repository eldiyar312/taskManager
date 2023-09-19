import { EnumsEnvironment, EnumsMode } from 'src/_generated';

export const MODE = (process.env.NODE_ENV || 'undefined') as EnumsMode;
export const PUBLIC_ENV = process.env.PUBLIC_ENV as EnumsEnvironment;

export const INTEGRATIONS = {
  ROLLBAR: {
    ENABLED: PUBLIC_ENV !== 'local',
    TOKEN: process.env.INTEGRATIONS_ROLLBAR_TOKEN || '',
  },
  SENDGRID: {
    ENABLED: PUBLIC_ENV !== 'local',
    TOKEN: process.env.INTEGRATIONS_SENDGRID_TOKEN || '',
  },
  MAILGUN: {
    ENABLED: PUBLIC_ENV !== 'local',
    MAILGUN_API_KEY: process.env.INTEGRATIONS_MAILGUN_API_KEY || '',
    MAILGUN_API_HOST: 'https://api.eu.mailgun.net',
  },
  VK: {
    ENABLED: true,
    VK_API_VERSION: '5.131',
    VK_SERVICE_TOKEN: process.env.INTEGRATIONS_VK_SERVICE_TOKEN || '',
    VK_GROUP_ACCESS_TOKEN: process.env.INTEGRATIONS_VK_GROUP_ACCESS_TOKEN || '',
    VK_API_URL: 'https://api.vk.com',
    GROUP_ID: 0,
    RETURN_VERIFY_STRING:
      process.env.INTEGRATIONS_VK_RETURN_VERIFY_STRING || '',
  },
  GOOGLE: {
    ENABLED: true,
    GOOGLE_API_URL: 'https://www.googleapis.com',
  },
} as const;

const configs: Record<
  EnumsEnvironment,
  {
    API_HOST: string;
    CLIENT_URL: string;
    DB_USER: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_NYC: string;
    DB_CERTIFICATE_PATH: string;
  }
> = {
  local: {
    API_HOST: 'localhost',
    CLIENT_URL: 'http://localhost:3000',
    DB_USER: '',
    DB_NAME: 'photospace',
    DB_HOST: '127.0.0.1',
    DB_NYC: '',
    DB_CERTIFICATE_PATH: '',
  },
  staging: {
    API_HOST: '',
    CLIENT_URL: '',
    DB_USER: '',
    DB_NAME: '',
    DB_HOST: '',
    DB_NYC: '',
    DB_CERTIFICATE_PATH: '',
  },
  production: {
    API_HOST: '',
    CLIENT_URL: '',
    DB_USER: '',
    DB_NAME: '',
    DB_HOST: '',
    DB_NYC: '',
    DB_CERTIFICATE_PATH: './db-certificate.crt',
  },
};

export const {
  API_HOST: HOST,
  CLIENT_URL,
  DB_USER,
  DB_NAME,
  DB_HOST,
  DB_NYC,
  DB_CERTIFICATE_PATH,
} = configs[PUBLIC_ENV];

export const ORIGIN = Object.values(configs).map(
  ({ CLIENT_URL }) => CLIENT_URL
);

export const PORT = Number(process.env.BACKEND_PORT || 8000);

export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_PORT = process.env.BACKEND_DB_PORT || '27017';

export const DB_CONNECTION = (() => {
  if (MODE === 'test' && process.env.MONGO_URL) {
    return process.env.MONGO_URL;
  }

  if (DB_HOST === '127.0.0.1') {
    return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }

  const certificate = DB_CERTIFICATE_PATH ? `&tls=true&authSource=admin` : '';

  const replicaSet = DB_NYC ? `&replicaSet=${DB_NYC}` : '';
  const protocol = DB_PORT ? 'mongodb' : 'mongodb+srv';
  const port = DB_PORT ? `:${DB_PORT}` : '';

  return `${protocol}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}${port}/${DB_NAME}?retryWrites=true&w=majority${certificate}${replicaSet}`;
})();

export const SESSION_SECRET = process.env.BACKEND_SESSION_SECRET || '';
export const PASSWORD_SALT = process.env.BACKEND_PASSWORD_SALT || '';
