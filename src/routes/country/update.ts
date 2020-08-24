import { Routes, ServerContext, Context } from "../../types";

export default class UpdateCountryRoute implements Routes
{
  private serverContext : ServerContext;
  private context : Context; 

  constructor(serverContext : ServerContext, context : Context){
    this.serverContext = serverContext;
    this.context = context;
  }

  setUpRoutes() {
    this.put('/countries');

    // updating of countries should be here maybe after send the response
    // however since the countries api listAll is mocking reject / resolve
    // setting of updated countries, currently resides on the `CountryModel`
  }

  put(url : string) {
    const  { request, response } = this.serverContext;

    if (request.url === url && request.method === 'PUT') {
      let data : any = [];
      request.on('data', chunk => {
        data.push(chunk);
      });

      request.on('end', () => {
        const { code, name } = JSON.parse(data)        
        response.write(JSON.stringify({
          // @ts-ignore
          country :  this.context.models.country.updateOne(code, { name } )
        }));
        response.end();
      });
    }
  }
}