import { Country } from '../../countries/types'
import { connect, runCommand } from '../../redis'

export const seed = async (countries: Country[]) => {
  await connect()
  await runCommand('flushall', 'SYNC')

  for (let country of countries) {
    await runCommand(
      'hset',
      country.id,
      'population',
      country.population,
      'name',
      country.name,
      'code',
      country.code,
    )

    await runCommand('sadd', 'countries', country.id)
  }
}
