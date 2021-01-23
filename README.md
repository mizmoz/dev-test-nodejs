# Nodejs Developer Test

## To run

npm run build
docker-compose up


## Endpoints
- Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts` (GET localhost:8000/countries)
- Create an endpoint to fetch all of the countries sorted by their population (GET localhost:8000/sort/<asc/desc>)
- Allow the populations to be updated (PUT localhost:8000/update/population/<country code>/<number>)
- Allow countries to be updated (PUT localhost:8000/update/country/<country code>/<name>)
- Allow countries to be deleted (DELETE localhost:8000/delete/country/<country code>)
- Auth (username: username, password: password)