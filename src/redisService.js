
/* jshint esversion: 6 */


const RedisServer = require('redis-server');


// Start the redis server
//
const redisServer = new RedisServer(6379);

// redisServer.open()
// .then(() => {
//   console.log('Redis Server Started');
// })
// .catch(() => {
//   console.log('Failed to start Redis Server');
// });

// redisServer.open((err)=>{
//   if ( err === null) {
//     console.log('Redis Server Started');
//     // store = redis.createClient();

//     // store.on('connect', function() {
//     //   console.log('connected to redis store');
//     // } );
//   } else {
//     console.log('Failed to start Redis Server');
//   }
// });