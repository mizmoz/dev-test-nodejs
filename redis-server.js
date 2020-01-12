const
    redis = require("redis"),
    jsonServer = require('json-server'),
    server = jsonServer.create(),
    router = jsonServer.router( process.env.SERVERDATABASEFILENAME );

    console.log(process.env);
const
  redisClient = redis.createClient( {
      host: process.env.REDISENDPOINTADDRESS,
      port: process.env.REDISENDPOINTPORT
  } );

// let the router know what the ID key is given the db
router.db._.id = "code";

router.render = (req, res) => {

  if( [ 'PATCH', 'POST' ].indexOf( req.method ) !== -1 )
  {
    delete res.locals.data.id;
    
    redisClient.hmset( `c:${res.locals.data.code}`, res.locals.data);
  }

  // just forward the usual output
  res.jsonp(res.locals.data);
}

const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen( process.env.SERVERPORT, () => {
  console.log( `JSON Server is running on port ${process.env.SERVERPORT}` )
})
