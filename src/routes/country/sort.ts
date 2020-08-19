import { Routes, ServerContext, Context } from "../../types";

export default class SortCountryPopulationRoute implements Routes
{
  private serverContext : ServerContext;
  private context : Context; 

  constructor(serverContext : ServerContext, context : Context){
    this.serverContext = serverContext;
    this.context = context;
  }

  setUpRoutes() {
    this.put();
  }

  put() {
    const  { request, response } = this.serverContext;

    const regex = new RegExp("^/countries/sort/population/ASC|DES$");
    const url = request.url || '';

    if (regex.test(url) && request.method === 'GET') {

      const urlPath = url.split('/');
      const order = urlPath[4] === 'ASC' ? 'ASC' : 'DES';

      response.write(JSON.stringify({
        // @ts-ignore
        countries :  this.context.models.country.sortCountries(order)
      }));
      response.end();
    }
  }
}