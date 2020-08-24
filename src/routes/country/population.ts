import { Routes, ServerContext, Context } from "../../types";

export default class UpdateCountryPopulationRoute implements Routes
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

    const regex = new RegExp("^/countries/[a-z]*/population$");
    const url = request.url || '';

    if (regex.test(url) && request.method === 'PUT') {

      const urlPath = url.split('/');
      const code = urlPath[2];

      let data : any = [];
      request.on('data', chunk => {
        data.push(chunk);
      });

      request.on('end', () => {
        const { population } = JSON.parse(data)        
        response.write(JSON.stringify({
          // @ts-ignore
          country :  this.context.models.country.updatePopulation(code, { population } )
        }));
        response.end();
      });
    }
  }
}