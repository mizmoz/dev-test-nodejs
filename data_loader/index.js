const countries = require('./countries');
const redis = require('redis');
const { ADMIN_USERNAME, ADMIN_PASSWORD, SHA_SECRET } = process.env;
const crypto = require('crypto');

const client = redis.createClient({
  host: 'redis',
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
});

function loadData() {

  return new Promise((resolve, reject) => {
    client.on('connect', function() {
      console.log('Connected to redis, migrating countries.');
      countries.forEach(c => {
        client.hmset(`country:${c.code}`, 'name', `${c.name}`, 'code', `${c.code}`, 'population', c.population);
        client.zadd(['countries_by_population', c.population, c.code]);
      });


      console.log('Creating admin user w/ creds');
      const hash = crypto.createHmac('sha256', SHA_SECRET)
        .update(ADMIN_PASSWORD)
        .digest('base64');

      const u = {
        username: ADMIN_USERNAME,
        password: hash
      }

      client.set(`user:${ADMIN_USERNAME}`, JSON.stringify(u), (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('User created');
          resolve(true);
        });
      });



    // error timeout
    setTimeout(() => {
      reject(new Error('migration timeout'));
    }, 60000);

  });
}

return loadData();



