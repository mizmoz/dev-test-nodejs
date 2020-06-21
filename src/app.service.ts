import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { RedisService } from 'nestjs-redis';
import countries from './data/country';
import { Country, SortOrder } from './types';

const CACHE_KEY = 'countries';

@Injectable()
export class AppService {
  private _client: Redis.Redis;

  constructor(private readonly redisService: RedisService) { }

  get cacheClient() {
    if (!this._client) {
      this._client = this.redisService.getClient();
    }

    return this._client;
  }

  async getCountries(order: SortOrder) {
    const listSize = await this.cacheClient.llen(CACHE_KEY);
    if (listSize === 0) {
      await this.loadCountries();
    }
    const range = await this.cacheClient.lrange(CACHE_KEY, 0, listSize);
    const countries: Country[] = range.map(str => JSON.parse(str));

    countries.sort((a, b) => this.sortCountries(a, b, order));

    // Sort alphabetically
    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }

  private sortCountries(a: Country, b: Country, order: SortOrder) {
    if (a.population === b.population) {
      return a.name.localeCompare(b.name);
    }

    return order === SortOrder.ASC ? a.population - b.population : b.population - a.population;
  }

  async loadCountries() {
    const defaultCountries: Country[] = countries;
    return await this.cacheClient.lpush(CACHE_KEY, defaultCountries.map(c => JSON.stringify({...c, population: 0})));
  }
}
