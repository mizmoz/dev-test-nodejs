import { Injectable, NotFoundException } from '@nestjs/common';
import * as Redis from 'ioredis';
import { RedisService } from 'nestjs-redis';
import countries from './data/country';
import { Country, CountryDTO, SortOrder } from './types';

const CACHE_KEY = 'countries';

@Injectable()
export class AppService {
  private _client: Redis.Redis;

  constructor(private readonly redisService: RedisService) {
    this._client = this.redisService.getClient();
  }

  get cacheClient() {
    if (!this._client) {
      this._client = this.redisService.getClient();
    }

    return this._client;
  }

  async getCountries(order: SortOrder) {
    const countries: Country[] = await this.countryList();
    return countries.sort((a, b) => this.sortCountries(a, b, order));
  }

  async resetCountries() {
    await this.cacheClient.del(CACHE_KEY);
    await this.countryList();

    return;
  }

  /**
   * Update country details and population
   * @param code Country CODE
   * @param data Payload
   */
  async updateCountry(code: string, data: CountryDTO): Promise<Country> {
    const countries = await this.countryList();
    const editIndex = countries.findIndex(country => country.code === code);
    if (editIndex === -1) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }

    const oldData = countries[editIndex];
    const newData = Object.assign(oldData, data);

    this.cacheClient.lset(CACHE_KEY, editIndex, JSON.stringify(newData));
    return newData;
  }

  /**
   * Delete country by code
   * @param code country code
   */
  async deleteCountry(code: string): Promise<void> {
    const countries = await this.countryList();
    const deleteIndex = countries.findIndex(country => country.code === code);
    if (deleteIndex === -1) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }

    await this.cacheClient.lrem(CACHE_KEY, 1, JSON.stringify(countries[deleteIndex]));
    return;
  }

  private async loadCountries() {
    const defaultCountries: Country[] = countries;
    return await this.cacheClient.lpush(CACHE_KEY, defaultCountries.map(c => JSON.stringify({ ...c, population: 0 })));
  }

  private sortCountries(a: Country, b: Country, order: SortOrder) {
    if (!!a.name && !!b.name && a.population !== undefined && b.population !== undefined) {
      if (a.population === b.population) {
        return a.name.localeCompare(b.name);
      }

      return order === SortOrder.DESC ? a.population - b.population : b.population - a.population;
    }

    return 0;
  }

  private async countryList(): Promise<Country[]> {
    const listSize = await this.cacheClient.llen(CACHE_KEY);
    if (listSize === 0) {
      await this.loadCountries();
    }
    const range = await this.cacheClient.lrange(CACHE_KEY, 0, listSize);
    return range.map(str => JSON.parse(str));
  }
}
