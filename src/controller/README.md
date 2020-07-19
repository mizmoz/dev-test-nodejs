# Solution Doco

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

### Update country name
**Method**: PUT

**Path**: /countries/:countryCode

### Delete country from list
**Method**: DEL

**Path**: /countries/:countryCode
