import { IncomingMessage, ServerResponse } from "http";

export interface Country {
  name: string;
  code: string;
  population? : number;
}

export type Context = {
  models : {
    country? : BaseCountryModel;
  }
}

export type ServerContext = {
  request : IncomingMessage;
  response : ServerResponse;
}

export interface Server {
  start() : void
  applyRoutes(severContext : ServerContext, context : Context) : void
}

export interface BaseCountryModel{
  listAll(mockReject : boolean) : Promise<Country[] | []>;
  getOne(code:string) : Country | undefined;
  deleteOne(code:string) : boolean;
  updateOne(code: string, data : {name: string}) : Country | undefined;
  updatePopulation(code: string, data : {population : number}) : Country | undefined;
  sortCountries(order : 'ASC' | 'DES') : Country[];
}

export interface Routes 
{
  setUpRoutes() : void;
}
