const { promisify } = require("util");



  const redis = require("redis");
 const client = redis.createClient({
    host: "redis",
    port: 6379, // env
  });


export default {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
};
