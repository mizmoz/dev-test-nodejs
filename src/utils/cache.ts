const Redis = require('ioredis')

const redis = new Redis()

/**
 * @param  {string} key
 * @returns Promise
 */
const get = (key: string): Promise<object | null> => {
  return new Promise(resolve => {
    try {
      redis.get(key).then(function(result: string) {
        resolve(JSON.parse(result))
      })
    } catch (err) {
      resolve(null)
    }
  })
}

/**
 * @param  {string} key
 * @param  {any} value
 * @param  {number=1000} ex
 * @returns Promise
 */
const set = (key: string, value: any, ex: number = 1000): Promise<any> => {
  return redis.set(key, JSON.stringify(value), 'EX', ex)
}

export default {
  get,
  set,
}
