# API endpoints
### Public
- POST /login - authenticate and receive access token for secure endpoint calls
    - request body
      ```json
      {
        "username": "john.doe@cloudemployee.com",
        "password": "NotastrongPassword123!" 
      }
      ```
    - response: 
    ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      }
    ```

### Secure

For the endpoints below the bearer token Authorization header must be set on each request using the 
token acquired from the login route:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

- GET /country/{code} - get 1 country using 3 letter code as identifier
    - response: 
    ```json
    {
        "code": "phi",
        "population": "72000000",
        "name": "Republic of the Philippines"
    }
    ```
- GET /countries?sort=population|{asc | desc} - Get list of all countries sorted by population in ascending order by default. Note
that the `sort` query parameter is optional.
    - response: 
    ```json
    [
        {
            "name": "AMERICAN SAMOA",
            "code": "asa",
            "population": "55465"
        },
        {
            "name": "ALBANIA",
            "code": "alb",
            "population": "2866376"
        },
        ...
    ]
    ```
- PUT /countries/{code} - create or overwrite an existing country with the 3 letter code.
  - request body
      ```json
      {
        "population": "106700000",
        "name": "Pilipinas" 
      }
      ```
  
  - reponse:
     
    ```json
    {
        "population": "106700000",
        "name": "Pilipinas",
        "code": "phi"
    }
    ```
- DELETE /countries/{code} - delete a country record.
  - reponse:
     
    ```json
    {
        "population": "106700000",
        "name": "Philippines",
        "code": "phi"
    }
    ```    
    