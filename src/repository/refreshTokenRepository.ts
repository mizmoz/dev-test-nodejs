import { redis } from './RedisConnection'

const hashKey = 'refreshTokens'

// set expiry for each get
export const findByUsername = (username: string) => {
    return redis.pipeline()
        .expire(`${hashKey}:${username}`, Number.parseInt(process.env.REFRESH_TOKEN_EXPIRATION!, 10))
        .get(`${hashKey}:${username}`)
        .exec((err, results) => {
            // `err` is always null, and `results` is an array of responses
            // corresponding to the sequence of queued commands.
            // Each response follows the format `[err, result]`.
            return results[1][1] // return result of get
        });
}

export const save = (username: string, refreshToken: string) => {
    return redis.set(`${hashKey}:${username}`, refreshToken, 'EX', process.env.REFRESH_TOKEN_EXPIRATION)
}

export const remove = (username: string) => {
    return redis.del(`${hashKey}:${username}`)
}