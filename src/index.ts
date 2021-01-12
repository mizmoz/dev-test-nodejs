import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import getCountries from './api/country'
import { Country } from './types'

const schema = buildSchema(`
  enum SortBy {
    name
    code
    population
  }
  input CountryInput {
    name: String
    code: String
    population: Int
  }
  type Country {
    name: String!
    code: String!
    population: Int
  }
  type Query {
    countries(sortBy: SortBy): [Country]
  }
  type Mutation {
    updateCountry(current: CountryInput, update: CountryInput): Country
    deleteCountry(code: String): String
  }
`)

const app = express()

// should have stored the countries data to redis
const getStoredCountries = async () => {
  let countries: Country[]
  try {
    countries = await getCountries()
  } catch (error) {
    console.error('Server error. Trying again after 2 seconds')
    await sleep(2000)
    countries = await getStoredCountries()
  }
  return countries
}

getStoredCountries().then((storedCountries = []) => {
  const rootValue = {
    countries: async (arg: { sortBy: string }) => {
      const { sortBy } = arg
      switch (sortBy) {
        case 'name':
          return storedCountries.sort((current, next) => {
            if (current.name === next.name) return 0
            return current.name > next.name ? 1 : -1
          })
        case 'code':
          return storedCountries.sort((current, next) => {
            if (current.code === next.code) return 0
            return current.code > next.code ? 1 : -1
          })
        case 'population':
          return storedCountries.sort((current, next) => {
            const currentPopulation = current.population || 0
            const nextPopulation = next.population || 0
            if (currentPopulation === nextPopulation) return 0
            return currentPopulation < nextPopulation ? 1 : -1
          })
        default:
          return storedCountries
      }
    },
    updateCountry: async (arg: { current: Country; update: Country }) => {
      const { current, update } = arg
      if (
        storedCountries.some(
          country =>
            (country.code === update.code || country.name === update.name) &&
            current.code !== country.code,
        )
      ) {
        throw new Error("Can't have country with same name or code")
      }
      const countryToUpdate = storedCountries.find(country => country.code === current.code)
      Object.assign(countryToUpdate, { ...update })
      return countryToUpdate
    },
    deleteCountry: async (arg: { code: string }) => {
      const { code } = arg
      const countryToDelete = storedCountries.find(_country => _country.code === code)
      if (countryToDelete) {
        const index = storedCountries.indexOf(countryToDelete)
        storedCountries.splice(index, 1)
      } else {
        throw new Error("Country doesn't exist")
      }
      return `Deleted country ${countryToDelete.name}`
    },
  }

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue,
      graphiql: true,
    }),
  )

  app.listen(8000, () => {
    console.log('running graphql server at port http://localhost:8000/graphql')
  })
})

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
