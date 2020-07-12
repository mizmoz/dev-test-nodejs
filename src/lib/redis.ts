import redis from 'redis';

class Redis {
  client: redis.RedisClient | null = null;
  private static instance: Redis;

  private constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }

  get <T> (key: string): Promise<T | null>{
    return new Promise((resolve, reject) => {
      this.client!.get(key, (err, value) => {
        if (err) {
          return reject(err);
        }

        resolve(value ? JSON.parse(value) : null);
      });
    });
  }

  set <T> (key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client!.set(key, JSON.stringify(value), (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}

export default Redis;
