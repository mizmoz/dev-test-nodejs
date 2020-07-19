console.log("Hello and good luck!");

import Country from './controller/country';
import Redis from './services/redis';
import Server from './services/server';

const server = new Server().getServer();
const redis = new Redis();

// Initalize controllers
Country(server, redis);
