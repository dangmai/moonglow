export default {
  "secretKey": "088a55ea6e34ba41370160e2edec6c3c8a77e382f43304bdd50ca5d87ddec13f77ea18c63d416b815b5530af0804fc8acdd7b0d5523d034188ae99ee5ebfcb54",
  "database": {
    "type": "sqlite",
    "database": "database.sqlite",
    "synchronize": true,
    "logging": false,
    "entities": [
      process.cwd() + "/entity/**/*.ts"
    ],
    "migrations": [
      "migration/**/*.ts"
    ],
    "subscribers": [
      "subscriber/**/*.ts"
    ],
    "cli": {
      "entitiesDir": "entity",
      "migrationsDir": "migration",
      "subscribersDir": "subscriber"
    }
  }
}
