# Nodejs Developer Test

## The Task

Create a simple node service that provides provides some endpoints to allow the listing and updating of a
list of countries and their population. This task should take 2-3 hours but don't worry if you aren't able to
complete all items, just make sure to show your understanding of the core technologies we use.

1. Fork this repo
2. Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts`
3. Create an endpoint to fetch all of the countries sorted by their population
4. Allow the populations to be updated
5. Allow countries to be updated
6. Allow countries to be deleted
7. Add authentication using the `src/api/authenticate.ts` method
8. When you're done commit your code and create a pull request

Bonus points for

1. Storing the data in Redis
2. Allowing the app to be run from a docker-compose file

A basic project outline has been created to help you get started quickly but feel free to start from scratch if you have a preferred setup.

Feel free to use the internet including Google and Stackoverflow to help with the task

## Any questions?

Please just ask.

Good luck and thanks for taking the time to complete this task!

## Running the App

To run this app:

1. Rename `.env.example` to `.env`, and update the values accordingly.
2. Run `docker-compose up --build`.

## Stopping the App

To stop this app:

Run this command: `docker-compose down`

## Endpoints

### `POST` /api/auth

Authentication using Basic Auth Header

Header:

```json
{
  "username": "username",
  "password": "password",
}
```

Response:

```json
{
    "message": "Authentication Success",
    "success": true
}
```

### `GET` /api/country

Get list of countries.

Response:

```json
{
  "results": [
    {
      "name": "AFGHANISTAN",
      "code": "afg",
      "population": 0
    },
    {
      "name": "ALBANIA",
      "code": "alb",
      "population": 0
    },
    ...
  ],
  "success": true
}
```

### `GET` /api/country/{code}

Get specific country

Response:

```json
{
  "result": {
    "name": "PHILIPPINES",
    "code": "phi",
    "population": 560
  },
  "success": true
}
```

### `DELETE` /api/country/{code}

Delete a country.

Response:

```json
{
  "message": "Country deleted!",
  "success": true
}
```

### `PUT` /api/country/{code}

Update a country's data.

Body:

```json
{
  "name": "South Sudan",
  "code": "ssd",
  "population": 100
}
```

Response:

```json
{
    "message": "Country updated!",
    "success": true
}
```
