import express from "express";
import countriesRouter from "./routers/countriesRouter";
import redisClient from "./redis";
import countries from "./configs/country";
import validate from './middleware/validate'
const app: express.Application = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

app.use(validate);

app.use("/countries", countriesRouter);

const initialize = async () => {
  const cacheCountry = await redisClient.getAsync("countries");

  if (!cacheCountry) {
    await redisClient.setAsync("countries", JSON.stringify(countries));
    console.log("Save intial countries");
  }
};

initialize();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
