import { Environment } from '../interfaces/environment.model';

export const environment: Environment = {
  production: false,
  sandbox: false,
  expressUrl: 'http://localhost:81/api',
  socketHost: 'localhost:81/',
  version: '1.2.97'
};
