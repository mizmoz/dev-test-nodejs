import * as Redis from 'ioredis';
const { REDIS_URI } = process.env;

export default new Redis.default(REDIS_URI || 'redis://127.0.0.1:6379');
