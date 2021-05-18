import redis from 'redis'
import { promisify } from 'util'

let client: redis.RedisClient
let asyncCommand: (commandName: string, ...args: any[]) => Promise<any>

export const runCommand = <T>(commandName: string, ...args: any[]): Promise<T> =>
  asyncCommand(commandName, args)

export const connect = async () =>
  new Promise((resolve, reject) => {
    client = redis.createClient({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: 6379,
    })
    client.on('ready', resolve)
    client.on('error', reject)
    asyncCommand = promisify(client.sendCommand).bind(client)
  })

export const quit = () =>
  new Promise(resolve => {
    client.quit(resolve)
  })

export const parseResponse = <T>(response: string[], fields: string[]): T => {
  const result = []
  const numberOfRows = response.length / fields.length
  for (let rowNumber = 0; rowNumber < numberOfRows; rowNumber++) {
    const row: { [key: string]: string } = {}
    for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
      row[fields[fieldIndex]] = response[rowNumber * fields.length + fieldIndex]
    }

    result.push(row)
  }

  return (result as unknown) as T
}
