// const Redis = require('ioredis')
// const redis = new Redis();

// // const client = redis.createClient({
// //     host: 'redis-server',
// //     port: 6379// env
// // })

// export default redis;

const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient();

export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
//   keysAsync: promisify(client.keys).bind(client),
};
