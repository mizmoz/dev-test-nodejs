# Nodejs Developer Test Submission

## Installation

```bash
$ yarn
```

## Running the app

Before starting, ensure that a redis instace is setup and the connection details are provided in `config/default.js`

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Docker Compose

Rename `.env.example` to `.env` and provide appropriate values. Afterwards, run the following command:

```bash
docker-compose up
```

A redis backend as well as the web app would be made available once docker finishes instatiating the containers.

## Documentation URL

[Access Swagger documentation here](http://localhost:8080/docs)