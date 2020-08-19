import { Routes, ServerContext, Context } from "../../types";

export default class DeleteCountryRoute implements Routes
{
  private serverContext : ServerContext;
  private context : Context; 

  constructor(serverContext : ServerContext, context : Context){
    this.serverContext = serverContext;
    this.context = context;
  }

  setUpRoutes() {
    this.delete();
  }

  delete() {
    const  { request, response } = this.serverContext;
    const regex = new RegExp("^/countries/[a-z]*$");

    const url = request.url || '';

    if (regex.test(url) && request.method === 'DELETE') {

      const urlPath = url.split('/');
      const code = urlPath[2];

      response.write(JSON.stringify({
        // @ts-ignore
        ok : this.context.models.country.deleteOne(code) 
      }));
      response.end();
    }
  }
}