import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_CONNECT_URL)

redis.on('connect', () => {
    // tslint:disable-next-line: no-console
    console.log('Connected to Redis.')
})
