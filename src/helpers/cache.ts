import Redis from "ioredis";

const redis = new Redis();

export const get = (key: string): Promise<object | null> => {
  return new Promise(resolve => {
    try {
      redis.get(key).then((result: string | null) => {
        if (result) {
          resolve(JSON.parse(result));
        } else {
          resolve(null);
        }
      });
    } catch (err) {
      resolve(null);
    }
  });
};

export const set = (key: string, value: any, ex: number = 1000): Promise<any> =>
  redis.set(key, JSON.stringify(value), "EX", ex);

export const del = (key: string) => redis.del(key);
