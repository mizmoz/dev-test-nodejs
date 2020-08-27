import { createServer } from "http";

import mainServer from './server'
import redisClient from './redis'

const hostname = 'localhost';
const port = 5001;

const server = createServer(mainServer);

server.listen(port, hostname, () => {
    console.log(`Server running at http://localhost:${port}/`);


    // console.log(redisClient.get("key"));

});


