import redis from 'redis'
const client = redis.createClient({
    host: 'redis-server',
    port: 6379// env
})

export default client;