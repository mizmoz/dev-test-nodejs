import * as redis from "redis";
import { promisify } from 'util';

export const redisClient = redis.createClient({ host: 'redis'});


export const hGetAll = promisify(redisClient.hgetall).bind(redisClient);
export const zRange = promisify(redisClient.zrange).bind(redisClient);
export const zRevRange = promisify(redisClient.zrevrange).bind(redisClient);
// cannot use the promisify approach on other methods..