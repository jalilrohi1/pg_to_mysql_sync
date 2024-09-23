const { MysqlModel } = require("../models");
const { getModelAttributes } = require("./utils");
const { mysqlSequelize } = require("../config/database");
const readLogFiles = require("./readLogFiles");
const { mergeDefaults } = require("sequelize/lib/utils");

// const wkx = require("wkx");
// const { fn, col } = require("sequelize");

// Define the syncrout function
const synctomysql = async (req, res, next) => {
  try {
    const logEntries = await readLogFiles();
    for (const logEntry of logEntries) {
      const { operation, table, primaryKeycol, data } = logEntry;
      const attributes = await getModelAttributes(data, primaryKeycol);
      const MyModel = mysqlSequelize.define(table, attributes, {
        tableName: table,
        timestamps: false,
        freezeTableName: true,
      });
      await MyModel.sync();

      if (operation === "INSERT" || operation === "UPDATE") {
        await MyModel.upsert(data);
      } else if (operation === "DELETE") {
        if (!primaryKeycol || Object.keys(primaryKeycol).length === 0) {
          throw new Error(
            "Primary key column(s) must be provided for DELETE operations."
          );
        }
        await MyModel.destroy({ where: primaryKeycol });
      }
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).send("Synchronization failed");
  }
};

module.exports = synctomysql;
