import dotenv from 'dotenv-flow';

const result = dotenv.config();

if (result.error) {
  throw result.error;
}
