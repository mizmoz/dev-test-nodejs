import Koa from "koa";
import { pub, priv } from "./controllers";
import serve from "koa-static";
import cors from "@koa/cors";
import mount from "koa-mount";
import redis from "redis";
import bodyparser from "koa-bodyparser";
import { promisify } from "util";

const app = new Koa();
const client = redis.createClient(
  process.env.REDIS_URL || "redis://localhost:6379",
);
app.keys = ["randomGeneratedKey", "randomGeneratedKeyMaster"];

// serve the react build directory
const reactPages = new Koa();
reactPages.use(serve(`${__dirname}/client/build`));
app.use(mount("/", reactPages));

app
  .use(bodyparser())
  .use(async (ctx, next) => {
    const getAsync = promisify(client.get).bind(client);
    const setAsync = promisify(client.set).bind(client);

    ctx.redisMethods = {
      getAsync,
      setAsync,
    };

    await next();
  })
  .use(cors({ origin: "*" }))
  .use(pub.routes())
  .use(pub.allowedMethods())
  .use(priv.routes())
  .use(priv.allowedMethods())
  .use(serve(`${__dirname}/src/client/build`));

app.listen(process.env.APP_PORT || 3000);
