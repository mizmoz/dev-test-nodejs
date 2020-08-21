import redis, { RedisClient } from 'redis';

import { BaseServer } from './base/Server';
import { Context, ServerContext } from './types';
import { CountryModel } from './models/Country';
import countries from './configs/country';

// implement better
import ListCountriesRoute from './routes/country/list';
import UpdateCountryRoute from './routes/country/update';
import GetCountryRoute from './routes/country/getOne';
import DeleteCountryRoute from './routes/country/deleteOne';
import UpdateCountryPopulationRoute from './routes/country/population';
import SortCountryPopulationRoute from './routes/country/sort';
import authenticate from './api/authenticate';

export default class Service extends BaseServer
{
  constructor(config : {
    port : string
  }) {
    super(config);
  }

  setUpDependency(cb : (err : Error | null) => void) {
    // connect to db or any thing
    const redisClient : RedisClient = redis.createClient({
      host : process.env.REDIS_HOST,
      port : Number(process.env.REDIS_PORT || 6379)
    })

    redisClient.on('connect', () => {
      redisClient.set('countries', JSON.stringify(countries));
      this.context.models.country = new CountryModel(redisClient, countries);
      cb(null);
    });
  }

  async applyRoutes(serverContext : ServerContext, context : Context) {
    
    // @TODO authentication to be added as middleware

    const { request, response} = serverContext;

    try {
      // better to use token e.g jwt
      // @ts-ignore
      const isAuthorized = await authenticate(request.headers['x-username'], request.headers['x-password']);
      
      if (!isAuthorized) {
        response.statusMessage = 'Unauthorized Access';
        response.writeHead(403, { "Content-Type": "application/json" });
        response.write(JSON.stringify({
          message : "Access denied"
        }));
        
        response.end();
      } else {
        response.writeHead(200, { "Content-Type": "application/json" });
        // maybe loop thru the file
        // or bootstrap from another file
        const listCountriesRoute = new ListCountriesRoute(serverContext, context);
        listCountriesRoute.setUpRoutes(); 
        
        const updateCountryRoute = new UpdateCountryRoute(serverContext, context);
        updateCountryRoute.setUpRoutes();

        const getCountryRoute = new GetCountryRoute(serverContext, context);
        getCountryRoute.setUpRoutes();

        const deleteCountryRoute = new DeleteCountryRoute(serverContext, context);
        deleteCountryRoute.setUpRoutes();

        const updatePopulation = new UpdateCountryPopulationRoute(serverContext, context);
        updatePopulation.setUpRoutes();

        const sortCountryRoute = new SortCountryPopulationRoute(serverContext, context);
        sortCountryRoute.setUpRoutes();
      }
    } catch (err) {
      response.statusMessage = 'Unauthorized Access';
      response.writeHead(403, { "Content-Type": "application/json" });
      response.write(JSON.stringify({
        message : "Access denied"
      }));
      
      response.end();
    }
  }
}