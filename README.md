# Nodejs Developer Test

This project was forked from https://github.com/mizmoz/dev-test-nodejs

## Task report

Below are the list of tasks for this project. I worked on it for 4 hours, making sure implementation and unit tests work.

Task name | Completed?
--- | ---
Fork this repo | :heavy_check_mark:
Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts` | :heavy_check_mark:
Create an endpoint to fetch all of the countries sorted by their population | :heavy_check_mark:
Allow the populations to be updated | 
Allow countries to be updated | 
Allow countries to be deleted |
Add authentication using the `src/api/authenticate.ts` method |
When you're done commit your code and create a pull request | :heavy_check_mark:

### Bonus points

Task name | Completed?
--- | ---
Storing the data in Redis | :heavy_check_mark:
Allowing the app to be run from a docker-compose file | :heavy_check_mark:

### Installation

**Prerequisites:**

- Docker
- Docker compose

Setup `env` files:

```bash
cp .env.example .env
```

Build containers:

```bash
docker-compose up -d --build
```

Visit http://localhost:3000

**Note:** If you want to change the port, just replace `NODE_PORT` in the `.env` file and run `docker-compose up -d`

To get into `redis-cli`:

```bash
docker-compose exec redis sh

# In redis container:
redis-cli
```

### Unit tests

```bash
npm test
```
