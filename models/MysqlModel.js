const { DataTypes } = require("sequelize"); // Import the DataTypes object from the sequelize package to define model attributes with specific data types.

const { mysqlSequelize } = require("../config/database"); // Import the Sequelize instance configured for MySQL from the local configuration file.

// Define a new model called MysqlModel using the mysqlSequelize instance. This model maps to a table in MySQL named "your_mysql_table".
const MysqlModel = mysqlSequelize.define(
  "MysqlTable", // The name of the model. Sequelize uses this as the default table name unless a specific table name is provided.
  {
    id: {
      // Define an attribute named 'id' for the model.
      type: DataTypes.INTEGER, // Specify the data type of the 'id' attribute as INTEGER.
      primaryKey: true, // Mark the 'id' attribute as the primary key of the table.
      autoIncrement: true, // Enable auto-increment for the 'id' attribute. This means that MySQL will automatically assign an incrementing value to 'id' for new rows.
    },
    data: {
      // Define another attribute named 'data'.
      type: DataTypes.STRING, // Specify the data type of the 'data' attribute as STRING.
    },
    updatedat: {
      // Define an attribute named 'updatedAt'.
      type: DataTypes.DATE, // Specify the data type of the 'updatedAt' attribute as DATE.
    },
  },
  {
    timestamps: false, // Disable automatic timestamping by Sequelize. Sequelize can automatically add createdAt and updatedAt fields to models, but this is turned off here.
    tableName: "mysql_testtb", // Explicitly specify the name of the table in the MySQL database that this model represents.
  }
);

module.exports = MysqlModel; // Export the MysqlModel so it can be imported and used in other parts of the application.
