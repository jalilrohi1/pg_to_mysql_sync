const { Sequelize } = require("sequelize");
require("dotenv").config();

const pgSequelize = new Sequelize(process.env.PG_DATABASE_URL, {
  dialect: "postgres",
});

const mysqlSequelize = new Sequelize(process.env.MYSQL_DATABASE_URL, {
  dialect: "mysql",
});

module.exports = { pgSequelize, mysqlSequelize };
