# Mizmoz Node API with MySQL in Docker

## Run project locally

1. Run `docker-compose up --build`. This will also run migrations for the first time for **Countries** with no values yet for field `population` and initial user `admin/admin`

## Endpoints

### Countries

`GET`

- `/countries` - lists all countries
  - Query Parameters
    - `order` - *string (optional)*, columnName. Ex: `name`, default is `population`
    - `sort` - *enum: asc | desc (optional)*, Default: `desc`
- `/countries/:id` - gets a country
  - Parameter
    - `id` - *integer (required)* - Country ID

`POST`

- `/countries` - creates a country
  - Body (JSON)
    - `name` - *string (required)*, Country name. Ex: Philippines
    - `code` - *string (unique)(required)*, Country code. Ex: phi
    - `population` - *integer (optional)*, Country population.

`PATCH`

- `/countries/:id` - updates a country
  - Parameter
    - `id` - *integer (required)*, Country ID.
  - Body (JSON)
    - `name` - *string (optional)*, Country name.
    - `code` - *string (unique)(optional)*, Country code.
    - `population` - *integer (optional)*, Country population.

`DELETE`

- `/countries/:id` - deletes a country
  - Parameter
    - `id` - *integer (required)*, Country ID.

### Auth (user)

`POST`

- `/auth/login` - Authenticates a User
  - Body (JSON)
    - `username` - *string (unique)(required)*, User username.
    - `password` - *string (required)*, User password.
