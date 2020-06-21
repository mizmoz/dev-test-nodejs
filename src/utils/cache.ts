const Redis = require('ioredis')

const redis = new Redis()

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

const set = (key: string, value: any, ex: number = 1000): Promise<any> => {
  return redis.set(key, JSON.stringify(value), 'EX', ex)
}

export default {
  get,
  set,
}
