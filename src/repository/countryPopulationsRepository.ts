import { CountryPopulation } from '../types'
import { redis } from './RedisConnection'

const hashKey = 'countryPopulations'

export const findByCountryCode = (code: string) => {
    return redis.hget(hashKey, code)
}

export const findAll = () => {
    return redis.hgetall(hashKey)
}

export const save = (countryPopulation: CountryPopulation) => {
    return redis.hset(hashKey, countryPopulation.country, countryPopulation.population.toString())
}

export const remove = (code: string) => {
    return redis.hdel(hashKey, code)
}