
import { fastify } from 'fastify'
import _ from 'lodash'

import Countries from './api/country'
import { Country } from './types'
import prevaAuthValidation from './auth/preAuthValidation'
import { validationError, validationNotFound } from './errorResponse'

let countries: Country[]

const server = fastify({ logger: true })
const PORT = 8080

server.get('/', async (request: any, reply: any) => {
    reply.send({ name: 'Typescript Backend Test API', version: '0.0.1' })
})

server.get('/country', async (request: any, reply: any) => {
    reply.send({ result: countries })
})

server.get('/country/sort/:order', async (request: any, reply: any) => {
    const { params } = request
    const order: string = params.order || ''

    if (order !== 'asc' && order !== 'desc') throw validationError(`Invalid sorting '${order}' order . It should be 'asc' or 'desc' only.`)

    countries = _.orderBy(countries, ['population'], [order])

    reply.send({ result: countries })
})

server.patch('/country/:code', async (request: any, reply: any) => {
    const { params, body } = request
    const code: string = params.code || ''
    const population: number = parseInt(body.population)
    const name: string = body.name

    if (!code) throw validationError('Country code should not be empty.')

    const arrIndex = _.findIndex(countries, ['code', code])
    if (arrIndex < 0) throw validationNotFound(`Country code '${code}' does not exist.`)

    if (name) countries[arrIndex].name = name
    if (population) countries[arrIndex].population = population

    reply.send({ result: countries[arrIndex] })
})

server.delete('/country/:code', async (request: any, reply: any) => {
    const { params, body } = request
    const code: string = params.code || ''

    if (!code) throw validationError('Country code should not be empty.')

    const arrIndex = _.findIndex(countries, ['code', code])
    if (arrIndex < 0) throw validationNotFound(`Country code '${code}' does not exist.`)

    countries.splice(arrIndex, 1)

    reply.send({ result: countries })
})

server.addHook('preValidation', async (request: any) => {
    await prevaAuthValidation(request.headers.authorization)
})

const start = async () => {
    try {
        await server.listen(PORT, '0.0.0.0')
        countries = await Countries()
        server.log.info(`Running in ${PORT}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()
