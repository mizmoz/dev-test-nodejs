# How To Test

Authorization:
Username: username
Password: password

GET All countries
GET: http://localhost:3000/api/country/

SORT all countries
GET: http://localhost:3000/api/country?sort=ASC
or
GET: http://localhost:3000/api/country?sort=DESC

Get specific country

via path parameter

GET: http://localhost:3000/api/country/{code}
e.g
http://localhost:3000/api/country/phi

or

via querystring params
GET: http://localhost:3000/api/country?code={code}
GET: http://localhost:3000/api/country?name={name}
e.g
http://localhost:3000/api/country?code=phi

Update Population and Country Data
PUT: http://localhost:3000/api/country/{code}

body:
{
code: phi,
name: "Philippines-New",
population: 100000
}

delete data
DELETE: http://localhost:3000/api/country/{code}

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
