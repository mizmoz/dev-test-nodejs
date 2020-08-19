import http, { ServerResponse, IncomingMessage } from 'http';

import { Server, Context, ServerContext } from './../types';
import { nextTick } from 'process';

export class BaseServer implements Server {
  protected context : Context;
  private config : { 
    port: string
  }
  constructor(config : {
    port : string
  }) {

    this.config = config;

    this.context = {
      models : {}
    };
  };

  start(){
    this.setUpDependency((error : Error | null) => {
      if (error !== null) {
        throw new Error(error.message);
      }
      this.startServer();
    });
  }

  applyRoutes(serverContext : ServerContext, context : Context) {
    const { request, response } = serverContext;
    response.write(JSON.stringify({ok:true}));
    response.end()
  }

  setUpDependency(cb : (error : Error | null) => void) {
    throw new Error('Setup Dependency not implemented');
  }

  startServer() {
    http
      .createServer((request, response) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        this.applyRoutes({
          request,
          response
        }, this.context);
      })
      .listen(this.config.port);

    console.info(`Server listening to port ${this.config.port}`);
  }
}