const { DataTypes } = require("sequelize");
const { pgSequelize } = require("../config/database");

const PgModel = pgSequelize.define(
  "PgTable",
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
    tableName: "your_pg_table",
  }
);

module.exports = PgModel;
