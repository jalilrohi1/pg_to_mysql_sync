const { mysqlSequelize } = require("../config/database"); // Import the MySQL Sequelize instance from your config file

const testConnection = async (req, res, next) => {
  try {
    await mysqlSequelize.authenticate();
    console.log("MySQL connection has been established successfully.");
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Unable to connect to the MySQL database:", error);
    res.status(500).send("Database connection error"); // Send an error response
  }
};
module.exports = testConnection;
