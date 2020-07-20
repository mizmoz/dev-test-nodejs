require('dotenv/config');

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD
} = process.env;

module.exports = [{
  "type": "mysql",
  "host": DB_HOST,
  "port": DB_PORT || 3306,
  "username": DB_USERNAME,
  "password": DB_PASSWORD,
  "database": DB_DATABASE,
  "synchronize": true,
  "logging": false,
  "entities": [
    "src/database/entity/**/*.ts"
  ],
  "migrations": [
    "src/database/migration/**/*.ts"
  ],
  "subscribers": [
    "src/database/subscriber/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "src/database/entity",
    "migrationsDir": "src/database/migration",
    "subscribersDir": "src/database/subscriber"
  }
}];
