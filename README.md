# Nodejs Developer Test

## Testing

### list all countries
```
curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "{ countries { name, code, population } }" }' \
http://localhost:8000/graphql
```
### list all countries sorted by population descendingly
```
curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "{ countries (sortBy: population) { name, code, population } }" }' \
http://localhost:8000/graphql
```

### update a country
```
curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "mutation { updateCountry (current: {code: \"and\"}, update: {name: \"ANDOOORAAA\", population: 20}) { name, code, population } }" }' \
http://localhost:8000/graphql
```

### delete a country
```
curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "mutation { deleteCountry(code: \"and\") }" }' \
http://localhost:8000/graphql
```

### testing with graphiql
You can test the api at http://localhost:8000/graphql when running the app locally
