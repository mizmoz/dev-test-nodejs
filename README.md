1. Fork this repo
2. Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts`
    * endpoint is /src/api/country
3. Create an endpoint to fetch all of the countries sorted by their population
    * GET /country?sort=population&direction=asc
4. Allow the populations to be updated
    * PUT /country/id
5. Allow countries to be updated
    * PUT /country/id
6. Allow countries to be deleted 
    * DEL /country/id
7. Add authentication using the `src/api/authenticate.ts` method
8. When you're done commit your code and create a pull request

Bonus points for

1. Storing the data in Redis
2. Allowing the app to be run from a docker-compose file
  * used mongodb
