import redis, { RedisClient } from 'redis';
import bluebird from 'bluebird';

// bluebird.promisifyAll(redis.RedisClient.prototype);

const client = bluebird.promisifyAll(
  redis.createClient(
    process.env.REDIS_URI || 'redis://localhost',
  ) as RedisClient & {
    setAsync: (key: string, value: string) => Promise<void>;
    keysAsync: (pattern: string) => Promise<string[]>;
    getAsync: (key: string) => Promise<string | null>;
    existsAsync: (key: string) => Promise<number>;
    delAsync: (key: string) => Promise<void>;
    quitAsync: () => Promise<void>;
    flushdbAsync: () => Promise<void>;
  },
);

client.on('error', error => {
  console.error(error);
});

client.on('connect', function() {
  console.log('Connected to redis successfully');
});

export async function shutdownRedis() {
  await client.flushdbAsync();
  await client.quitAsync();
}

export default client;
