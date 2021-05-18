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

## SOLUTION

The solution includes endpoints as per the requirements for the "countries" resource.
It is added in a modular way, so other resources can be independently added if needed.

Basic HTTP authentication is added, using the existing function to authenticate as per the requirement.

Unit, integration and API tests are added for new code. The API tests will test the entire application including the DB connection.

To start the app, run
`docker-compose up`

Initially it will not have any data, so run
`npm i`
`npm run seed`

To run the tests, it needs to have a redis instance running (can just start the app with `docker-compose up` to share the DB), then run
`npm run test`
