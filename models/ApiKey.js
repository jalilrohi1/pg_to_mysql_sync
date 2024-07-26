const { DataTypes } = require("sequelize"); // Import the DataTypes object from the sequelize package to define model attributes with specific data types.
const { mysqlSequelize } = require("../config/database"); // Import the Sequelize instance configured for MySQL from the local configuration file. This instance is used to interact with the MySQL database.
// Define a new model called ApiKey using the mysqlSequelize instance. This model maps to a table in MySQL named "api_keys".
const ApiKey = mysqlSequelize.define(
  "ApiKey", // The name of the model. Sequelize uses this as the default table name unless a specific table name is provided.
  {
    uniquekey: {
      // Define an attribute named 'key' for the model.
      type: DataTypes.STRING, // Specify the data type of the 'key' attribute as STRING.
      primaryKey: true, // Mark the 'key' attribute as the primary key of the table.
    },
    client: {
      // Define another attribute named 'client'.
      type: DataTypes.STRING, // Specify the data type of the 'client' attribute as STRING.
    },
    active: {
      // Define an attribute named 'active'.
      type: DataTypes.BOOLEAN, // Specify the data type of the 'active' attribute as BOOLEAN.
      defaultValue: true, // Set the default value of the 'active' attribute to true. This means new records will be active by default unless specified otherwise.
    },
  },
  {
    timestamps: false, // Disable automatic timestamping by Sequelize. Sequelize can automatically add createdAt and updatedAt fields to models, but this is turned off here.
    tableName: "api_keys", // Explicitly specify the name of the table in the MySQL database that this model represents.
  }
);

module.exports = ApiKey;
