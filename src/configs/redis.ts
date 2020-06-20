import redis = require("redis");

const client: redis.RedisClient = redis.createClient();

client.on('connect', error => {
    console.error(`redis is connected`);
});

client.on('ready', error => {
    console.error(`redis is ready`);
});

client.on('error', error => {
  console.error(`redis error: `, error);
});

export default client;