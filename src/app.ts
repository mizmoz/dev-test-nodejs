import express from "express";
import bodyParser from "body-parser";
import { mainRoutes } from "./routes/MainRoutes";
import authenticate from "./api/authenticate";


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private async basicAuth (req:any, res:any, next:any) {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const auth = await authenticate(username, password);
    if (!auth) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    next();
  }

  private config(): void {
    // support application/json
    this.app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // authentication
    this.app.use(this.basicAuth);
    // Routing
    this.app.use("/", mainRoutes);
  }
}

export default new App().app;