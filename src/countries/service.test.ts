import { runCommand, parseResponse } from '../redis'
import { addCountry, updateCountry, deleteCountry, getCountries } from './service'

jest.mock('../redis')

const mockRunCommand = runCommand as jest.Mock
;(parseResponse as jest.Mock).mockImplementation((...args) =>
  jest.requireActual('../redis').parseResponse(...args),
)

describe('Countries service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCountries', () => {
    beforeEach(() => {
      mockRunCommand.mockResolvedValue(['2', 65, 'UK', 'gbr', '1', 10, 'Austria', 'aut'])
    })

    test('get countries', async () => {
      const result = await getCountries()

      expect(mockRunCommand.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "sort",
            "countries",
            "BY",
            "*->NOSORT",
            "GET",
            "#",
            "GET",
            "*->population",
            "GET",
            "*->name",
            "GET",
            "*->code",
            "ASC",
          ],
        ]
      `)
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "gbr",
            "id": "2",
            "name": "UK",
            "population": 65,
          },
          Object {
            "code": "aut",
            "id": "1",
            "name": "Austria",
            "population": 10,
          },
        ]
      `)
    })
    test('get countries ordered by population', async () => {
      const result = await getCountries('population')

      expect(mockRunCommand.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "sort",
            "countries",
            "BY",
            "*->population",
            "GET",
            "#",
            "GET",
            "*->population",
            "GET",
            "*->name",
            "GET",
            "*->code",
            "ASC",
          ],
        ]
      `)
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "code": "gbr",
            "id": "2",
            "name": "UK",
            "population": 65,
          },
          Object {
            "code": "aut",
            "id": "1",
            "name": "Austria",
            "population": 10,
          },
        ]
      `)
    })
  })

  describe('addCountries', () => {
    beforeEach(() => {
      mockRunCommand.mockResolvedValue(1)
    })

    test('adding a new country', async () => {
      const result = await addCountry({ code: 'gbr', name: 'UK', population: 65 })

      expect(mockRunCommand.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "hset",
            "id-gbr",
            "population",
            65,
            "name",
            "UK",
            "code",
            "gbr",
          ],
          Array [
            "sadd",
            "countries",
            "id-gbr",
          ],
        ]
      `)
      expect(result).toMatchInlineSnapshot(`
        Object {
          "code": "gbr",
          "id": "id-gbr",
          "name": "UK",
          "population": 65,
        }
      `)
    })
  })

  describe('updateCountry', () => {
    beforeEach(() => {
      mockRunCommand.mockResolvedValueOnce(1).mockResolvedValueOnce([652, 'UK-2', 'gbr-2'])
    })

    test('updating an existing country', async () => {
      const result = await updateCountry('id-gbr', { code: 'gbr-2', name: 'UK-2', population: 652 })

      expect(mockRunCommand.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "hset",
            "id-gbr",
            "population",
            652,
            "name",
            "UK-2",
            "code",
            "gbr-2",
          ],
          Array [
            "hgetall",
            "id-gbr",
          ],
        ]
      `)
      expect(result).toMatchInlineSnapshot(`
        Object {
          "code": "gbr-2",
          "id": "id-gbr",
          "name": "UK-2",
          "population": 652,
        }
      `)
    })
  })

  describe('deleteCountry', () => {
    beforeEach(() => {
      mockRunCommand.mockResolvedValueOnce(1)
    })

    test('deleting a country', async () => {
      const result = await deleteCountry('gbr')

      expect(mockRunCommand.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "srem",
            "countries",
            "gbr",
          ],
          Array [
            "del",
            "gbr",
          ],
        ]
      `)
      expect(result).toMatchInlineSnapshot(`undefined`)
    })
  })
})
