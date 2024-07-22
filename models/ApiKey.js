const { DataTypes } = require("sequelize");
const { mysqlSequelize } = require("../config/database");

const ApiKey = mysqlSequelize.define(
  "ApiKey",
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    tableName: "api_keys",
  }
);

module.exports = ApiKey;
