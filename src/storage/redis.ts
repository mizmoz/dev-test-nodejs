const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient(
  process.env.REDIS_URL || 'redis://localhost:6379',
)

module.exports = {
  ...client,
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
  keys: promisify(client.keys).bind(client),
  mget: promisify(client.mget).bind(client),
  del: promisify(client.del).bind(client),
}