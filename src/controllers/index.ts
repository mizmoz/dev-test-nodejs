import Router from "koa-router";
import { v4 as uuidv4 } from "uuid";
import authenticate from "../api/authenticate";
import getCountries from "../api/country";
import { orderBy, get } from "lodash";

const pub = new Router();
const priv = new Router();

// Fetch all countries and save them to redis initially
pub.get("/countries", async (ctx: any) => {
  const countries: any[] = await getCountries().catch(err => []);
  const { getAsync, setAsync } = ctx.redisMethods;

  // Check if there are already contents on redis
  // Redis data are all stringified
  const redisCountries = JSON.parse(await getAsync("countries"));

  if (redisCountries && redisCountries.length > 0) {
    return (ctx.body = redisCountries);
  }

  const body = countries.map(c => ({ ...c, id: uuidv4() }));
  await setAsync("countries", JSON.stringify(body));
  ctx.body = body;
});

// Sort by population
pub.get("/sort/:direction", async (ctx: any) => {
  const { getAsync } = ctx.redisMethods;

  const redisCountries: any[] = JSON.parse(await getAsync("countries"));

  ctx.body = orderBy(
    redisCountries,
    d => parseInt(get(d, "population", 0), 10),
    [ctx.params.direction],
  );
});

// Require basic authorisation on update endpoints
priv.use(async (ctx, next) => {
  const authorisationHeader = ctx.request.headers.authorization;
  const userAndPassBase64 = authorisationHeader.replace("Basic ", "");
  const decoded = Buffer.from(userAndPassBase64, "base64").toString("ascii");

  const [username, password] = decoded.split(":");
  const isAuthorized = await authenticate(username, password);

  if (isAuthorized) {
    return next();
  }

  ctx.body = "Invalid account";
  ctx.status = 401;
});

// Update country information based on id
priv.post("/countries/:id", async (ctx: any) => {
  const { id } = ctx.params;
  const { getAsync, setAsync } = ctx.redisMethods;

  const redisCountries: any[] = JSON.parse(await getAsync("countries"));

  const updateCountryIndex = redisCountries.findIndex(ct => ct.id === id);
  redisCountries[updateCountryIndex] = {
    ...ctx.request.body,
    id,
  };

  await setAsync("countries", JSON.stringify(redisCountries));
  ctx.body = "OK";
});

// Delete country from list
priv.del("/countries/:id", async (ctx: any) => {
  const { id } = ctx.params;
  const { getAsync, setAsync } = ctx.redisMethods;

  const redisCountries: any[] = JSON.parse(await getAsync("countries"));

  const updateCountryIndex = redisCountries.findIndex(ct => ct.id === id);
  redisCountries.splice(updateCountryIndex, 1);

  await setAsync("countries", JSON.stringify(redisCountries));
  ctx.body = "OK";
});

export { pub, priv };
