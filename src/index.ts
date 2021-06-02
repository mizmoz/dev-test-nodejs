import e, * as express from 'express';
import session from "express-session";
import * as http from 'http';
import listCountries from './api/country';
import auth from './api/authenticate';
import { Country, CountryPopulation } from './types';
import path from 'path';
import redis from 'redis';


let authenticated = false;

console.log("Starting simple node service!");

// Create a new express application instance
// http://localhost:8080/
const port = 8080;
let ping = 0;
const app: express.Application = express.default();

const sessconf = {
  secret: 'technical sub',
  resave: false,
  saveUninitialized: true
}
app.use(session(sessconf));

app.set("port", port);


async function getStaticListOfCountries(): Promise<Country[]> {
  let listOfCountries;
  do {
    listOfCountries = await listCountries().catch(() => {
      console.log('Sorry, failed, try again');
    });
    console.log('Dumping listOfCountries=' + listOfCountries);
  } while (!listOfCountries);
  return listOfCountries;
}




/**
 * Get the updated dynamic list of countries and their populations,
 * this allows countries to be added and also deleted from the final list
 * 
 * @returns 
 */
async function getDynamicListOfCountries(): Promise<CountryPopulation[]> {
  function getCountryInfo(code: string) {
    return new Promise<any>((resolve, reject) => {
      store.get(code, (err, value) => {
        if (err) {
          reject();
        } else {
          if (value !== null) {
            resolve(value);
          }
          reject();
        }
      })
    })
  }

  return new Promise((resolve, reject) => {
    let listOfCountries = [] as CountryPopulation[];
    store.keys("*", async (err, codes) => {
      console.log('Dumping codes=' + JSON.stringify(codes, null, 4));
      for (let code of codes) {
        let countryInfostr = await getCountryInfo(code);
        let countryInfo = JSON.parse(countryInfostr);
        console.log('Dumping countryInfo=' + JSON.stringify(countryInfo, null, 4));
        listOfCountries.push(countryInfo);
      }
      resolve(listOfCountries);
    });
  })

}


/** 
 * Check all requests for authentication
 */
app.all("/*", (req, res, next) => {
  console.log("in ALL, " + req.url);
  console.log('auth authenticated=' + authenticated);
  console.log('in global get ');


  if (req.url.startsWith("/authenticate")) {
    let [, , username, password] = req.url.split('/');
    console.log('auth username=' + username);
    console.log('auth password=' + password);

    auth(username, password).then((status) => {
      let response;
      if (status == true) {
        authenticated = true;
        response = {
          status: true,
          message: "Authentication passed"
        };
      } else {
        authenticated = false;
        response = {
          status: status,
          message: "Authentication failed"
        };
      }
      console.log('auth authenticated=' + authenticated);
      res.json(response);
    }
    ).catch(() => {
      let response = {
        status: false,
        message: "Authentication failed"
      };
      res.json(response);
    }
    );
  } else {
    if (!authenticated) {
      let response = {
        status: false,
        message: "unauthorised"
      };
      res.json(response);
    } else {
      console.log('Authenticated');
      next();
    }
  }
});



/**
 * Authenticate the user, set the session as OK for the life of the session
 * If the correct username and passeord are initially supplied
 * 
 */
app.get("/authenticate/*", (req, res) => {
  let [, , username, password] = req.url.split('/');
  console.log('auth username=' + username);
  console.log('auth password=' + password);

  auth(username, password).then((status) => {
    let response;
    if (status == true) {
      authenticated = true;
      response = {
        status: true,
        message: "Authentication passed"
      };
    } else {
      authenticated = false;
      response = {
        status: status,
        message: "Authentication failed"
      };
    }
    console.log('auth authenticated=' + authenticated);
    res.json(response);
  }
  ).catch(() => {
    let response = {
      status: false,
      message: "Authentication failed"
    };
    res.json(response);
  }
  );
})





// http://localhost:8080/ping
/**
 * Add a simple ping to check the express service
 */
app.get("/ping", (req, res) => {
  console.log("in /ping : " + ping);
  ping++;
  let response = {
    status: true,
    details: {},
    message: "ping : " + ping
  };
  res.json(response);
});


/**
 * Used to Reset the redis database, for dev use
 */
app.get("/countries/reset", async (req, res) => {
  console.log("in /countries/init");

  store.keys("*", async (err, codes) => {
    for (let code of codes) {
      console.log('deleting code=' + code);
      store.del(code);
    }
  });

  let response = {
    status: true,
    message: "Finished init of Country List"
  };
  res.json(response);
});


/**
 * List all the countries to the API, this is a dynamic
 * list initialised at the start by the supplied country list
 * 
 */
app.get("/countries/list", async (req, res) => {
  console.log("in /countries/list");

  let listOfCountries = await getDynamicListOfCountries();

  let response = {
    status: true,
    payload: listOfCountries,
    message: "Country List"
  };
  res.json(response);
});


/**
 * API to list the countries in sorted order, largest to smallest
 * 
 * use http://localhost:8080/countries/sort
 * 
 */
app.get("/countries/sort", async (req, res) => {
  console.log("in /countries/sort");

  function comparePopulation(a: any, b: any) {
    if (a.population > b.population) {
      return -1;
    }
    if (a.population < b.population) {
      return 1;
    }
    return 0;
  }

  let listOfCountries = await getDynamicListOfCountries();
  listOfCountries.sort(comparePopulation);

  let response = {
    status: true,
    payload: listOfCountries,
    message: "Sorted Country List"
  };
  res.json(response);
});



/** 
 * API to set the population of a country using the country code 
 * 
 * use http://localhost:8080/countries/set/population/afg/100
 * 
 * e.g. to set the population of afg to 100
 */
app.get("/countries/set/population/*", async (req, res) => {
  console.log("in /countries/set/population");
  console.log(req.url);
  let [, , , , ccode, pop] = req.url.split('/');
  console.log('ccode=' + ccode);
  console.log('pop  =' + pop);

  store.get(ccode, (err, jstr) => {
    if (jstr !== null) {
      let countryInfo = JSON.parse(jstr);
      console.log('Dumping countryInfo=' + JSON.stringify(countryInfo, null, 4));
      countryInfo.population = parseInt(pop);
      store.set(ccode, JSON.stringify(countryInfo), () => {
        let response = {
          status: true,
          payload: [ccode, pop],
          message: "Update was successful"
        };
        res.json(response);
      })
    }
  });
});




/** 
 * API to add a new country to the list 
 * 
 * use http://localhost:8080/countries/add/United Kingdon/uk/7099
 * 
 * to set the population of the united kingdom to 7099 and enter into the database.
 */
app.get("/countries/add/*", async (req, res) => {
  console.log("in /countries/add/name/code/population");
  console.log(req.url);
  let [, , , name, code, pop] = req.url.split('/');
  name = decodeURIComponent(name);
  console.log('name=' + name);
  console.log('code=' + code);
  console.log('pop  =' + pop);

  let info: CountryPopulation = {
    code: code,
    name: name,
    population: parseInt(pop)
  }

  store.set(code, JSON.stringify(info), () => {
    let response = {
      status: true,
      payload: [name, code, pop],
      message: "Update was successful"
    };
    res.json(response);
  })
});




/** 
 * API to delete the country using the country code 
 * 
 * use http://localhost:8080/countries/delete/afg
 * 
 * e.g. remove Afganistan from the list
 */
app.get("/countries/delete/*", async (req, res) => {
  console.log("in /countries/delete/countryCode");
  console.log(req.url);
  let [, , , code] = req.url.split('/');
  console.log('code=' + code);

  store.del(code, () => {
    let response = {
      status: true,
      payload: code,
      message: "Delete was successful"
    };
    res.json(response);
  })
});


/**
 * Serve a readme html on a wrong request
 */
app.get('*', (req, res) => {
  let dirname = __dirname.replace(/\\/g, "/");
  console.log('dirname dirname=' + dirname);
  res.sendFile(path.join(dirname + '/../public/index.html'));
});


const redisConfig = {
  host: "127.0.0.1",
  port: 6379
}

let store = redis.createClient(redisConfig.port, redisConfig.host,);

store.on('connect', () => {
  console.log('connected to redis store');
});

// store.set('afg', '29', () => {
//   console.log('Stored test value');
// });
store.get('uk', (err, value) => {
  console.log('store value=' + value);
})

store.keys("*", (err, keys) => {
  console.log('Dumping keys=' + JSON.stringify(keys, null, 4));
})

// Initialise the countries into redis with a value of population zero on
// first itteration
//
getStaticListOfCountries().then((listOfCountries) => {
  console.log('A.Dumping listOfCountries=' + JSON.stringify(listOfCountries, null, 4));
  for (let country of listOfCountries) {
    store.get(country.code, (err, val) => {
      if (val === null) {
        // console.log(country.code + ' population = ' + obj.population);
        console.log('setting initial value of ' + country.code);
        let info = {
          name: country.name,
          code: country.code,
          population: 0
        }
        store.set(country.code, JSON.stringify(info));
      }
    });
  }
});


// Start the http and express service
//
const server = http.createServer(app);
var server_port = port;
server.listen(server_port, () => {
  console.log("Server at: http://localhost:" + server_port); // eslint-disable-line no-console
});

