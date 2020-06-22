import { Server, ResponseToolkit, Request } from '@hapi/hapi';
import { CountryUpdate, Credentials } from '../types';
import Joi from '@hapi/joi';
import { v1 as uuidv1 } from 'uuid';
import redis from '../lib/redis';

const Router = async (server: Server) => {
  server.route({
    method: 'GET',
    path: '/countries',
    handler: async (request: Request, h: ResponseToolkit) => {
      let countries = await server.methods.fetchAll();

      return { countries };
    },
    options: {
      auth: 'default',
      description: 'Get all countries',
      notes: 'Returns all countries',
      tags: ['api'],
    }
  })

  server.route({
    method: 'GET',
    path: '/countries/population',
    handler: async (request: Request, h: ResponseToolkit) => {
      const sort = request.query.sortBy || 'desc';

      let countries = await server.methods.fetchAllByPopulation();

      const byPopulation = sort === 'desc' ? countries : countries.reverse()

      return { countries: byPopulation };
    },
    options: {
      auth: 'default',
      description: 'Get all countries by population count',
      notes: 'Returns all countries sorted by population',
      tags: ['api'],
      validate: {
        query: Joi.object({
          sortBy: Joi.string().valid('asc', 'desc'),
        })
      }
    }
  })

  server.route({
    method: 'PUT',
    path: '/countries/{code}',
    handler: async (request: Request, h: ResponseToolkit) => {
      const { target, value } = <CountryUpdate>request.payload;
      const { code } = request.params;

      const updatedCountry = await server.methods.updateCountry(code, target, value)

      return { success: true };
    },
    options: {
      auth: 'default',
      description: 'Update a country',
      notes: 'Update a country data',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          target: Joi.string().valid('name', 'code', 'population').required(),
          value: Joi.string().min(1).required()
        }),
        params: Joi.object({
          code: Joi.string().length(3).required(),
        })
      }
    }
  })

  server.route({
    method: 'DELETE',
    path: '/countries/{code}',
    handler: async (request: Request, h: ResponseToolkit) => {
      const { code } = request.params;

      await server.methods.deleteCountry(code)

      return { success: true };
    },
    options: {
      auth: 'default',
      description: 'Delete a country',
      notes: 'Delete a country from database',
      tags: ['api'],
      validate: {
        params: Joi.object({
          code: Joi.string().length(3).required(),
        })
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/login',
    handler: async (request: Request, h: ResponseToolkit) => {
      const { username, password } = <Credentials>request.payload;

      const valid = await server.methods.login(username, password)

      if (!valid) return h.response('unauthorized')

      const session_token = uuidv1();

      await redis.setex(session_token, 60 * 60 * 2, 'valid')

      return { session_token };
    },
    options: {
      auth: false,
      description: 'Get session',
      notes: 'Create session token',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          username: Joi.string().min(4).max(50).required(),
          password: Joi.string().min(8).max(150).required(),
        })
      }
    }
  })
}

export default Router