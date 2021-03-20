import config from 'config';
import redis from 'redis';
import { promisify } from 'util';

const redisConnection = config.get<string>('redis') || 'redis://localhost:6379';

const client = redis.createClient(redisConnection);

export const get = promisify(client.get).bind(client);

export const getKeysByPrefix = (prefix: string ): Promise<string[]> => new Promise((resolve, reject) => {
  client.keys(prefix, (error, keys) => {
    if (error) {
      return reject(error);
    }

    return resolve(keys);
  })
});

export const set = promisify(client.set).bind(client);

export const del = (key: string): Promise<number> => new Promise((resolve, reject) => {
  client.del(key, (error, num) => {
    if (error) {
      return reject(error);
    }

    return resolve(num);
  });
});
