/**
 * Module Dependencies
 */
import config from '@config'; // eslint-disable-line import/no-unresolved
import Redis from 'ioredis';

export default new Redis({
  host: config.get('REDIS_HOST'),
  password: config.get('REDIS_PASSWORD'),
  port: config.get('REDIS_PORT'),
});
