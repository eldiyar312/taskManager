type PublicEnv = 'local' | 'staging' | 'production';

export const PUBLIC_ENV = process.env.REACT_APP_PUBLIC_ENV as PublicEnv;
export const APP_VERSION = process.env.REACT_APP_VERSION || '';

export const INTEGRATIONS = {
  ROLLBAR: {
    ENABLED: PUBLIC_ENV !== 'local',
    TOKEN: process.env.REACT_APP_INTEGRATIONS_ROLLBAR_TOKEN || '',
  },
  VK: {
    ENABLED: true,
    APP_ID: 0,
    WEBSITE_URL: '',
  },
  GOOGLE: {
    ENABLED: true,
    CLIENT_ID: '',
  },
} as const;

const configs: Record<PublicEnv, { API_HOST: string; CLIENT_HOST: string }> = {
  local: {
    API_HOST: 'localhost:8000',
    CLIENT_HOST: 'localhost:3000',
  },
  staging: {
    API_HOST: 'api.example.com', // TODO
    CLIENT_HOST: 'example.com', // TODO
  },
  production: {
    API_HOST: 'api.example.com', // TODO
    CLIENT_HOST: 'example.com', // TODO
  },
};

export const { API_HOST, CLIENT_HOST } = configs[PUBLIC_ENV];
