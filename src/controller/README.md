# Solution Doco

## Start App
### Docker
Run `$ sh setup-start-docker.sh` on project's root dir
### OR
### Yarn
**Prerequisite**: make sure to install redis on local machine via Docker. `ALLOW_EMPTY_PASSWORD: yes`


Run `$ yarn start` on project's root dir

## Authentication Header
Basic Auth - username / password

## Endpoints

### Domain: http://localhost:9090


### Listing of the countries
**Method**: GET

**Path**: /countries

### Listing of the countries sorted by their population
**Method**: GET

**Path**: /countries/population/:sort

### Update population by country
**Method**: PUT

**Path**: /countries/population/:countryCode

**Request Body**:
```
{
    "name": [string]
}
```

### Update country name
**Method**: PUT

**Path**: /countries/:countryCode

**Request Body**:
```
{
    "population": [number]
}
```

### Delete country from list
**Method**: DEL

**Path**: /countries/:countryCode
