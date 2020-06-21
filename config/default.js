const env = process.env;

module.exports = {
  NODE_ENV: env.NODE_ENV || 'development',
  PORT: Number(env.PORT) || 8080,
  USERNAME: env.USERNAME || 'username',
  PASSWORD: env.PASSWORD || 'password',
  REDIS_DB: env.REDIS_DB || 0,
  REDIS_HOST: env.REDIS_HOST || 'localhost',
  REDIS_PORT: env.REDIS_PORT || 6379,
  REDIS_PASSWORD: env.REDIS_PASSWORD || null,
};
