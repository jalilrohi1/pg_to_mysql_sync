const { DataTypes } = require("sequelize");
const { pgSequelize } = require("../config/database"); //// Import the pgSequelize object from a local configuration file. This object is an instance of Sequelize configured to connect to a PostgreSQL database.

//// Define a new model called PgModel using the pgSequelize instance. This model represents a table in your PostgreSQL database.
const PgModel = pgSequelize.define(
  "PgTable", // The name of the model, which Sequelize uses to derive the table name unless a specific table name is given.
  {
    id: {
      // Define the first column of the table.
      type: DataTypes.INTEGER, // Specifies the data type of the column, in this case, an integer.
      primaryKey: true, // Indicates that this column is the primary key of the table.
      autoIncrement: true, // Indicates that the value of this column should automatically increment with each new record.
    },
    data: {
      // Define the second column of the table.
      type: DataTypes.STRING, // Specifies the data type of the column, in this case, a string.
    },
    updatedAt: {
      // Define the third column of the table.
      type: DataTypes.DATE, // Specifies the data type of the column, in this case, a date.
    },
  },
  {
    timestamps: false, // Disables automatic timestamping by Sequelize. Sequelize can automatically add createdAt and updatedAt fields to your models, but this is turned off here.
    tableName: "pg_TestTB", // Specifies the exact name of the table in the database. This overrides the default naming convention of Sequelize.
  }
);

module.exports = PgModel;
