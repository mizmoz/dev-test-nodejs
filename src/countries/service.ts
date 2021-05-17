import { Country } from './types'
import { runCommand, parseResponse } from '../redis'

const getCountryById = async (id: string): Promise<Country> => {
  const savedCountry = parseResponse<Omit<Country, 'id'>[]>(await runCommand('hgetall', id), [
    'population',
    'name',
    'code',
  ])

  return { id, ...savedCountry[0] }
}

export const getCountries = async (requestedSortBy = '') => {
  const allowedSortBy = ['population', 'name']
  const sortBy = allowedSortBy.includes(requestedSortBy) ? requestedSortBy : 'NOSORT'

  const countries = parseResponse(
    await runCommand(
      'sort',
      'countries',
      'BY',
      `*->${sortBy}`,
      'GET',
      '#',
      'GET',
      '*->population',
      'GET',
      '*->name',
      'GET',
      '*->code',
      'ASC',
    ),
    ['id', 'population', 'name', 'code'],
  )

  return countries
}

export const addCountry = async (data: Omit<Country, 'id'>) => {
  const country: Country = { ...data, id: `id-${data.code}` }

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

  return country
}

export const updateCountry = async (
  id: string,
  country: Partial<Omit<Country, 'id'>>,
): Promise<Country> => {
  let updates = []
  if (country.population) {
    updates.push('population', country.population)
  }
  if (country.name) {
    updates.push('name', country.name)
  }
  if (country.code) {
    updates.push('code', country.code)
  }

  await runCommand('hset', id, ...updates)

  return getCountryById(id)
}

export const deleteCountry = async (id: string) => {
  await runCommand('srem', 'countries', id)
  await runCommand('del', id)
}
