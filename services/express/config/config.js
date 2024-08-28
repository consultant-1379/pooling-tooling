const config = require('./config.json');

const env = process.env.NODE_ENV || 'DEV_LOCAL_MONGO';
const envConfig = config[env];

Object.keys(envConfig).forEach((key) => {
  process.env[key] = envConfig[key];
});
