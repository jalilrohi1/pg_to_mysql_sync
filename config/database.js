const Sequelize = require("sequelize"); // Import the Sequelize constructor from the sequelize package. Sequelize is an ORM for Node.js that supports multiple dialects.

require("dotenv").config(); // Import and execute the config function from the dotenv package. This loads environment variables from a .env file into process.env.

const pgSequelize = new Sequelize(process.env.PG_DATABASE_URL, {
  // Create a new Sequelize instance for PostgreSQL.
  dialect: "postgres", // Specify the dialect for Sequelize. This tells Sequelize which type of database it will be communicating with.
});

const mysqlSequelize = new Sequelize(process.env.MYSQL_DATABASE_URL, {
  // Create a new Sequelize instance for MySQL.
  dialect: "mysql", // Specify the dialect for Sequelize. This tells Sequelize which type of database it will be communicating with.
});

module.exports = { pgSequelize, mysqlSequelize }; // Export the Sequelize instances. This allows them to be imported and used in other parts of the application.
