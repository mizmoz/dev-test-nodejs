import { Server } from "@hapi/hapi";
import db from './sqlite';
import countries_db from '../configs/country';
import * as HapiSwagger from 'hapi-swagger';
import authenticate from '../api/authenticate';
import authScheme from './authentication_scheme';
import Routes from '../routes';
const pkg = require('../../package.json')

const loadPlugins = async (server: Server) => {
  const _db = db.init(countries_db);

  server.method('fetchAll', _db.fetchAll);
  server.method('fetchAllByPopulation', _db.fetchAllByPopulation);
  server.method('updatePopulation', _db.updatePopulation);
  server.method('updateCountry', _db.updateCountry);
  server.method('deleteCountry', _db.deleteCountry);

  // pseudo login method
  server.method('login', authenticate);

  // route authentication schema
  server.auth.scheme('x-query-digest', authScheme);
  server.auth.strategy('default', 'x-query-digest');

  await Routes(server);

  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Test API Documentation',
          version: pkg.version,
        },
        securityDefinitions: {
          default: {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'x-keyPrefix': 'X-QUERY-DIGEST '
          }
        },
        'security': [{ 'default': [] }]
      }
    }
  ]);
}

export default loadPlugins;