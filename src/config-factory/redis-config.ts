import { RedisModuleOptions } from 'nestjs-redis';
import { get } from 'config';

export const redisFactory = async (): Promise<RedisModuleOptions> => {
  return {
    db: get('REDIS_DB'),
    host: get('REDIS_HOST'),
    password: get('REDIS_PASSWORD'),
    port: get('REDIS_PORT'),
  };
};
