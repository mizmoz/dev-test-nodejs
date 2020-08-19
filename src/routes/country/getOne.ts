import { Routes, ServerContext, Context } from "../../types";

export default class GetCountryRoute implements Routes
{
  private serverContext : ServerContext;
  private context : Context; 

  constructor(serverContext : ServerContext, context : Context){
    this.serverContext = serverContext;
    this.context = context;
  }

  setUpRoutes() {
    this.get();
  }

  get() {
    const  { request, response } = this.serverContext;
    const regex = new RegExp("^/countries/[a-z]*$");

    const url = request.url || '';

    if (regex.test(url) && request.method === 'GET') {

      const urlPath = url.split('/');
      const code = urlPath[2];

      response.write(JSON.stringify({
        // @ts-ignore
        country : this.context.models.country.getOne(code)
      }));
      response.end();
    }
  }
}