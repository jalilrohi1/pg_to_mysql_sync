const { DataTypes } = require("sequelize");
const { mysqlSequelize } = require("../config/database");

const MysqlModel = mysqlSequelize.define(
  "MysqlTable",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: "your_mysql_table",
  }
);

module.exports = MysqlModel;
