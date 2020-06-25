const knex = require("knex");

const knexConfig = require("./knexfile.ts");

const dbEnv = process.env.DB_ENV || "development";

module.exports = knex(knexConfig[dbEnv]);
