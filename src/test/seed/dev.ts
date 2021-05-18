import { Country } from '../../countries/types'
import countriesBaseData from './country'
import { seed } from './seed'
import { quit } from '../../redis'

const seedDev = async () => {
  try {
    const countries = countriesBaseData.map(
      (country): Country => ({
        id: `id-${country.code}`,
        population: Math.floor(Math.random() * 100000000) + 100000,
        ...country,
      }),
    )
    await seed(countries)
  } catch (error) {
    console.error(error)
  } finally {
    await quit()
  }
}

seedDev()
