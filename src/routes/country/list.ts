import { Routes, ServerContext, Context, Country } from "../../types";

export default class ListCountriesRoute implements Routes
{
  private serverContext : ServerContext;
  private context : Context; 

  constructor(serverContext : ServerContext, context : Context){
    this.serverContext = serverContext;
    this.context = context;
  }

  setUpRoutes() {
    this.get('/countries');
  }

  async get(url : string) {
    const  { request, response } = this.serverContext;
    
    if (request.url === url && request.method === 'GET') {
      
      let countries : Country[];

      const mockResolve : boolean = (Math.round(Math.random()) === 0);
      try {
        // @ts-ignore
        countries = await this.context.models.country.listAll(mockResolve);
      } catch (err) {
        countries = [];
      }
      response.write(JSON.stringify({countries : countries}));
      response.end();
    }
  }
}