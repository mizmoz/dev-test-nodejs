import redis from 'redis';

export const redisClient = redis.createClient();

redisClient.on('connect', () => {
    console.log('Client connected to redis');
});

redisClient.on('ready', () => {
    console.log('Redis Client ready to use');
});

redisClient.on('error', (error) => {
    console.log(error.message);
});

redisClient.on('end', () => {
    console.log('Client disconnected to reddis');
});

process.on('SIGINT', () => {
    redisClient.quit();
});