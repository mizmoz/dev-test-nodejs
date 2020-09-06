# Nodejs Developer Test

<em>Note: Development was done in Ubuntu machine, docker configs will not work on different OS.</em>

## Installation and Setup(Ubuntu)
1. create .env file by copying `.env.example` and setting the JWT configs, password encryption key & the credentials of 
the admin user.
  ```sh
    $ cp .env.example .env
    $ vim .env
  ```
  ```
    JWT_SECRET=B736E86072085693C83959C5852D6507567A153911718EEC7AA8CF03C0B1734B
    JWT_EXPIRES=1h
    ADMIN_USERNAME=john.doe@cloudemployee.com
    ADMIN_PASSWORD=NotAStrongPassword123!
    SHA_SECRET=AA94EDA037D24415B4C559D480AD5971CA35472F00C9E162FDCBE19A79F6C745
  ```

2. Run the containers
    ```sh
    $ docker-compose up
    ```

## Endpoints
Please see [ENDPOINTS.md](ENDPOINTS.md)

## Miscellaneous
- I opted to just reset the country data everytime docker starts and just referenced this file for the country data `data_loader/countries.js`
The population data there is not accurate I just modified some values so that the sorting can be tested.
- Haven't had time to create unit tests(no experience applying it yet in javascript) but I'm willing to spend time on it if I can have an extension.
 