# Archax Tech Test by Ian Mark Muninio

## Prerequisites

- Nodejs 14
- Docker
- Yarn

---

## Setup and starting

1. Install dependencies using yarn. Make sure you are using node ***14*** version.
```sh
$ yarn install
```

2. Run docker containers using `docker-compose`.
```sh
docker-compose up [-d]
```

3. Start the application.
```sh
yarn start
```

For auto reloading
```sh
yarn dev
```

You can set the environment variables of the application using `dotenv` if you want to customize the application. Tho you need to make sure that you import the redis data under `<root>/data/redis` so all country data is available.

> The `dotenv` only works on development for security purposes.

Create a file `.env` under the `<root>` folder.

Environment variable table.

Key | Value
--- | ---
`HTTP_PORT` | The server port when starting the server. Default value is `8081`.
`REDIS_HOST` | The redis host url. Default value is `127.0.0.1`.
`REDIS_PASSWORD` | The redis password. Default value is `null`.
`REDIS_PORT` | The redis port to use. Default value is `6370`.

---

## API

Endpoint | Description
--- | ---
`GET /countries` | List all countries. Sortable by population. `?population=1`.
`GET /countries/:code` | Get the country by code.
`PUT /countries/:code/population` | Updates the population of a country. `{ population: number; }`
`PUT /countries/:code` | Update the country information. `{ name?: string; coordinates?: [number, number]; }`
`DEL /countries/:code` | Delete the specified country.

> Those with `:code` params, if the provided `:code` doesn't exist, the server will throw a `404 Bad Request` with a some small information of the error.

> For unknown error, for e.g. operation error, it will requtnr a `500 Internal Server Error` with information of the error.

All endpoints are private so you need to authenticate.

For now we are using `Basic` authentication.

Username | Password
--- | ---
`archax` | `p@$$m3plz`

---

## Developer Note

I haven't tried to compiled this for production use so much better to run this in uncompiled mode using `ts-node`.

I didn't create any unit tests and integration tests.
