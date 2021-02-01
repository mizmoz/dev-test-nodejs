# Nodejs Developer Test

## Finished Tasks

 - Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts`
    ```javascript
    {
        method: 'GET',
        url: 'http://localhost:8080/country',
    }
    ```
 - Create an endpoint to fetch all of the countries sorted by their population
     ```javascript
    {
        method: 'GET',
        url: 'http://localhost:8080/country/sort/<desc|asd>',
    }
    ```
 - Allow the populations to be updated
      ```javascript
    {
        method: 'PATCH',
        url: 'http://localhost:8080/country/<country code>',
        body: { population: 1000 }
    }
    ```
 - Allow countries to be updated
     ```javascript
    {
        method: 'PATCH',
        url: 'http://localhost:8080/country/<country code>',
        body: { name: 'Philippines - UPDATED' }
    }
    ```
 - Allow countries to be deleted 
    ```javascript
    {
        method: 'DELETE',
        url: 'http://localhost:8080/country/<country code>'
    }
    ```
 - Add authentication using the `src/api/authenticate.ts` method <br>
    **Using basic auth**
    ```javascript
    {
        username: 'admin',
        password: 'password'
    }
    ```
    


## Unfinished Tasks

 - Storing the data in Redis
 - Allowing the app to be run from a docker-compose file