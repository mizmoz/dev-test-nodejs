import { BasicStrategy } from "passport-http";
import passport from "passport";
import BaseRouter from "./base.router";
import CountryRouter from "./country.router";
import authSvc from "../api/authenticate";

class MainRouter extends BaseRouter {
  constructor() {
    super();
    let _router = this.getRouter();
    passport.use(
      new BasicStrategy(async (username: string, password: string, done) => {
        const isAuthenticated = await authSvc(username, password);
        if (!isAuthenticated) return done(null, null);
        return done(null, { username });
      }),
    );
    _router.use(
      "/country",
      passport.authenticate("basic", {
        session: false,
      }),
      CountryRouter.getRouter(),
    );
  }
}

export default new MainRouter();
