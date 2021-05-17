import redis from 'redis';
import { promisify } from 'util';

const connection = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient(connection);

export const set = promisify(client.set).bind(client);
export const get = promisify(client.get).bind(client);
export const flushdb = promisify(client.flushdb).bind(client);

export const getKeysByPrefix = (prefix: string ): Promise<string[]> => new Promise((resolve, reject) => {
  client.keys(prefix, (error, keys) => {
    if (error) {
      return reject(error);
    }

    return resolve(keys);
  })
});

export const remove = (key: string): Promise<number> => new Promise((resolve, reject) => {
  client.del(key, (error, num) => {
    if (error) {
      return reject(error);
    }

    return resolve(num);
  });
});
