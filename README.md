# Nodejs Developer Test by delwynb 🚀

## The Task

Create a simple node service that provides provides some endpoints to allow the listing and updating of a
list of countries and their population. This task should take 2-3 hours but don't worry if you aren't able to 
complete all items, just make sure to show your understanding of the core technologies we use.

- [x] Fork this repo
- [x] Create an endpoint that allows the listing of the countries using the method from `src/api/country.ts`
    - API `GET localhost:3000/country`
- [x] Create an endpoint to fetch all of the countries sorted by their population
    - API `GET localhost:3000/country`
    - PARAMS `sort? 'asc' or 'desc' defaults to 'asc'`
    ##### Example Usage
    - [http://localhost:3000/country?sort=desc] (http://localhost:3000/country?sort=desc)
- [x] Allow the populations to be updated
    - Update Country Population by Code
    - API `PUT localhost:3000/country/:code`
    - JSON BODY 
    ```
    {
        population: 110000000
    }
    ```
    ##### Example Usage
    [http://localhost:3000/country/phi](http://localhost:3000/country/phi)
    - with JSON Body
    ```
    {
        population: 110000000
    }
    ```
    - Verify using [http://localhost:3000/country/PHI](http://localhost:3000/country/PHI)
- [x] Allow countries to be updated
    - Update Country by Code
    - API `PUT localhost:3000/country/:code`
    - JSON BODY 
    ```
    {
        name: 'New Philippines'
        population: 110000000
    }
    ```
    ### Example Usage
    - [http://localhost:3000/country/phi](http://localhost:3000/country/phi)
    - with JSON Body 
    ```
    {
        name: 'New Philippines'
        population: 110000000
    }
    ```
- [] Allow countries to be deleted 
- [] Add authentication using the `src/api/authenticate.ts` method
- [] When you're done commit your code and create a pull request

# Bonus points for

- [] Storing the data in Redis
- [] Allowing the app to be run from a docker-compose file

A basic project outline has been created to help you get started quickly but feel free to start from scratch if you have a preferred setup.

Feel free to use the internet including Google and Stackoverflow to help with the task

## Any questions?

Please just ask.

Good luck and thanks for taking the time to complete this task!
