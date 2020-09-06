const countries = require('./countries');
const redis = require('redis');

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

function loadCountries() {

  return new Promise((resolve, reject) => {
    client.on('connect', function() {
      console.log('Connected to redis, migrating countries.');
      countries.forEach(c => {
        client.hmset(`country:${c.code}`, 'name', `${c.name}`, 'code', `${c.code}`, 'population', c.population);
        client.zadd(['countries_by_population', c.population, c.code]);
      });
      console.log('Country data migration complete!');
      resolve(true);

    });

    // error timeout
    setTimeout(() => {
      reject(new Error('migration timeout'));
    }, 3000);

  })
}

loadCountries();
return 0;


