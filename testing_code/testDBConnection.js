const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log(process.env.MYSQL_DATABASE_URL);

// const sequelize = new Sequelize("mysql_test_api", "jalil", "Genova", {
//   host: "127.0.0.1",
//   dialect: "mysql",
//   port: 3306,
// });
const sequelize = new Sequelize(process.env.MYSQL_DATABASE_URL, {
  dialect: "mysql",
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
