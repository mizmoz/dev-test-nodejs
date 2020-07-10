import * as redis from '../src/entities/redis';
import countries from '../src/configs/country';

(async () => {
  try {
    const redisClient = await redis.connect();

    console.log('Starting to seed data.');

    const countriesWithPopulation = countries.map(country => ({
      ...country,
      population: 0,
    }));
    await redis.set('countries', countriesWithPopulation);

    const username = process.env.AUTH_USERNAME || 'username';
    const password = process.env.AUTH_PASSWORD || 'password';
    await redis.set('authentication', {
      username,
      password,
    });

    console.log('Finished seeding data.');

    redisClient.end(true);
  } catch (error) {
    console.error('Something went wrong in seeding data.', error.message);
    process.exit(1);
  }
})();
