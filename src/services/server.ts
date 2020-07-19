import restify from 'restify';
import { ForbiddenError } from 'restify-errors';
import authenticate from './../api/authenticate';

const SERVER_CONF = {
  host: '0.0.0.0',
  port: 9090
};

export default class Server {
  private server: any;

  constructor() {
    this.server = restify.createServer();
    this.init();
  }

  public getServer() {
    return this.server;
  }

  private init() {
    this.server.listen(SERVER_CONF.port, SERVER_CONF.host, () => {
      console.log();
      console.log('*********************************');
      console.log(`Running on http://${SERVER_CONF.host}:${SERVER_CONF.port}`);
      console.log('*********************************');
      console.log();
    });

    this.server.use(
      restify.plugins.bodyParser(),
      async (req: any, res: any, next: any) => {
        // Auth stuff
        const { headers } = req;
        const { authorization } = headers;
        if (!authorization) {
          res.send(new ForbiddenError('Access denied'));
          return next(false);
        }

        const auth = authorization.split(' ');
        const basic = auth[0];
        if (basic !== 'Basic') {
          res.send(new ForbiddenError('Invalid authentication'));
          return next(false);
        }

        const token = auth[1];
        const userPass = Buffer.from(token, 'base64').toString('utf-8').split(':');
        const allow = await authenticate(userPass[0], userPass[1]);
        if (!allow) {
          res.send(new ForbiddenError('Invalid username / password'));
          return next(false);
        }

        return next();
      }
    );

    this.server.on('uncaughtException', (req: any, res: any, route: any, err: any) => {
      console.log();
      console.log(route);
      console.log();
      console.log(err);
      console.log();
    });
  }
}
