# Nodejs Developer Test

## Starting the App

To run this app:

1. Rename `.env.example` to `.env`, and update the values accordingly.
2. Run `docker-compose up --build`.
3. If redis' data is not yet initialized, go inside the node app container and run `npm run seeder` or simply run `docker-compose run node npm run seeder`.

## Stopping the App

To stop this app:

Run this command: `docker-compose down`

## Endpoints

In order to access the endpoints below, every request should contain a basic authentication with the username and password saved in redis.
Username and password can be set on `.env` and be saved to redis when `npm run seeder` is run.

### `GET` /countries

Get list of countries.

Query Params:
- sort_by - Country field to be compared for sorting. Possible values are `name`, `code` and `population`.
- order_by - Result order. Possible values are `asc`, and `desc`. Default value is `asc` if this param is not provided.

Response:

```json
{
  "message": "Here are the countries.",
  "data": [
    {
      "name": "AFGHANISTAN",
      "code": "afg",
      "population": 0
    },
    {
      "name": "ALBANIA",
      "code": "alb",
      "population": 0
    }
  ]
}
```

### `PUT` /countries/{country_name}

Update a country's data. Provide the country fields to be updated in the request body.

Body:

```json
{
  "population": 100
}
```

Response:

```json
{
  "message": "Country is updated."
}
```

### `DELETE` /countries/{country_name}

Delete a country.

Response:

```json
{
  "message": "Country is updated."
}
```