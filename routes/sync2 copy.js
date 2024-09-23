const express = require("express");
const { MysqlModel } = require("../models");
const { getModelAttributes } = require("../middleware/utils");
const { mysqlSequelize } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const validateApiKey = require("../middleware/apiKey");
const router = express.Router();
const wkx = require("wkx");
const { fn, col } = require("sequelize");

const readLogFiles = require("../middleware/readLogFiles");
const syncfialedlog = require("../middleware/syncfailedlog");

router.post("/yy", authenticateToken, validateApiKey, async (req, res) => {
  const logEntries = await readLogFiles();
  try {
    for (const logEntry of logEntries) {
      const { operation, table, primaryKeycol, data } = logEntry;
      const attributes = getModelAttributes(data, primaryKeycol);
      const MyModel = mysqlSequelize.define(table, attributes, {
        tableName: table,
        timestamps: false,
        freezeTableName: true,
      });
      // Sync the model to ensure it matches the table structure
      await MyModel.sync();

      // Convert WKT to a MySQL geometry type
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
    await syncfialedlog(logEntries);
    res.status(200).send("Synchronization successful");
  } catch (error) {
    console.error(error);
    await syncfialedlog(logEntries);
    res.status(500).send("Synchronization failed");
  }
});
module.exports = router;
