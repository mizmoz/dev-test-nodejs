import bluebird from 'bluebird';
import redisClient from '../library/redis';
import countries from '../configs/country';

export async function seed() {
  await bluebird.delay(1000);

  const refs = countries.map(({ name, code }) => {
    return redisClient.setAsync(
      code,
      JSON.stringify({
        name,
        code,
        population: Math.floor(Math.random() * 100),
      }),
    );
  });

  await Promise.all(refs);

  if (process.env.NODE_ENV !== 'test') {
    process.exit(0);
  }
}

seed();
