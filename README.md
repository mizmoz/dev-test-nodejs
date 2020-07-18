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

[](#solution)
# Solution

Requirements:
- [Docker Community Edition](https://www.docker.com/community-edition)
- node >= 10.16.0 or LTS

To start the application, run:
```sh
$ docker-compose up

# Then run these commands on a separate terminal to synchronize both redis and node app:
$ docker restart cache
$ docker restart dev-test-nodejs_app_1
```

**NOTE:**
- Every request must have the `Authorization` header so that the server can authenticate the user.

### 1. List all countries
```sh
$ curl 'http://localhost:3000/countries' -H 'Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ='
```

### 2. List all countries sorted by their population in ascending order
```sh
$ curl 'http://localhost:3000/countries/pop/asc' -H 'Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ='
```

### 3. List all countries sorted by their population in descending order
```sh
$ curl 'http://localhost:3000/countries/pop/desc' -H 'Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ='
```

### 4. Update the population of USA
```sh
$ curl 'http://localhost:3000/country/usa/pop' -X PUT -H 'Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=' -H 'Content-Type: application/json' -d '{"population":777}'
```

### 5. Update the details of PERU
```sh
$ curl 'http://localhost:3000/country/per' -X PUT -H 'Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=' -H 'Content-Type: application/json' -d '{"name":"PERU","code":"per","population":500}'
```

### 6. Delete the country of Zimbabwe
```sh
$ curl 'http://localhost:3000/country/zim' -X DELETE -H 'Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ='
```
