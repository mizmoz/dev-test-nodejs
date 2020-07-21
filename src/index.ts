import express , { Application } from 'express';
import passport from 'passport';
import path from 'path';
import serveStatic from 'serve-static';
import bodyParser from 'body-parser';
import session from 'express-session'
import apiRouter from './routes/api';
import mainRouter from './routes/index';
import passportConfig from './configs/passport'
import connectRedis from 'connect-redis';
import * as Redis from './configs/redis';

import countryFunction from './api/country';

let port = process.env.PORT || 5000;

let RedisStore = connectRedis(session);
declare global {
    let COUNTRY_LIST : [];
}
const app: Application = express();
let client = Redis.client;
app.set("views", "views");
app.set("view engine", "pug");
app.set("view options", {layout : false});
app.set('view cache', false);
app.use(express.json());
app.use(serveStatic(path.join(__dirname, "/../public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ 
    // store: new RedisStore({client}),
    secret: 'gBpwmwE0PmyDKPuLhhmY8CONJQW3TnCujQuoE8nVao',
  	resave:false,
  	saveUninitialized: false,
  	// cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use("/api", apiRouter)
app.use("", mainRouter)

client.on("ready", () => {
    client.flushall((err, success) => console.log("********** flush", err, success))
    countryFunction()
   .then(response => {
       let arrayData: Object[] = [];
       response.map((data) => {
            let country = {
                name : data.name,
                code : data.code,
                population : 0
            }

            client.set(country.code, JSON.stringify(country))
       })

    //    client.set("data", JSON.stringify(arrayData))
   })
   .catch(error => console.log("ERROR", error))
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})