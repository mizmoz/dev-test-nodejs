const redis = require('redis')
const { promisify } = require('util')
const client = redis.createClient(
  process.env.REDIS_URL || 'redis://localhost:6379',
)

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  mgetAsync: promisify(client.mget).bind(client),
  delAsync: promisify(client.del).bind(client),
}
