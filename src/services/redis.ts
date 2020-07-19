import { TedisPool } from 'tedis';
import country from '../api/country';
import {
  ICountry,
  IPopulation,
} from '../types';

const isProd = process.env.NODE_ENV === 'production';

const REDIS_CONF = {
  host: isProd ? 'redis' : 'localhost',
  port: 6379
};

export default class Redis {
  private pool: TedisPool;
  private retries: number = 0;

  constructor() {
    this.pool = new TedisPool({
      host: REDIS_CONF.host,
      port: REDIS_CONF.port,
    });

    this.init();
  }

  public getCountries = async () => {
    const tedis = await this.pool.getTedis();
    const countries: string | any = await tedis.get('countries');
    this.pool.putTedis(tedis);
    const countriesArr: ICountry =  JSON.parse(countries);
    return countriesArr;
  }

  public updateCountryList = async (countries: IPopulation) => {
    const tedis = await this.pool.getTedis();
    const isSuccess = await tedis.set('countries', JSON.stringify(countries)) === 'OK'? true : false;
    return isSuccess;
  }

  private init = async () => {
    const tedis = await this.pool.getTedis();

    tedis.on('error', (e) => {
      console.error(e);
    });

    // Check data if already loaded to redis
    this.getCountries().then((countries) => {
      if (countries) {
        console.log('Data already loaded to redis...');
        return;
      }

      // Load countries to redis
      console.log('Loading data to redis...');
      country().then(async (countries) => {
        const isLoaded = await tedis.set('countries', JSON.stringify(countries)) === 'OK'? true : false;
        console.log('Data loaded!', isLoaded);
  
        if (!isLoaded) {
          throw Error();
        }
      })
      .catch(() => {
        if (this.retries < 4) {
          this.retries++;
          console.warn(`Try reloading countries to redis | Retry attempt: ${this.retries}`);
  
          this.init();
          return;
        }
  
        console.error('!!! Error loading data to redis !!!');
      });
      this.pool.putTedis(tedis);
    });
  };
}
