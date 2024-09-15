const express = require("express");
const { MysqlModel } = require("../models");
const { getModelAttributes } = require("./utils");
const { mysqlSequelize } = require("../config/database");
const authenticateToken = require("../middleware/auth");
const validateApiKey = require("../middleware/apiKey");
const router = express.Router();
const wkx = require("wkx");
const { fn, col } = require('sequelize');
router.post("/", authenticateToken, validateApiKey, async (req, res) => {
  //router.post("/", async (req, res) => {
  const { operation, table, data, primaryKeycol } = req.body;
  // console.log("operation", primaryKeycol);
  try {
    const attributes = getModelAttributes(data, primaryKeycol);
    console.log("attributes in sync.js: 10101010100101010010101010101010101", attributes);
    const MyModel = mysqlSequelize.define(table, attributes, {
      tableName: table,
      timestamps: false,
      freezeTableName: true,
    });
    // Sync the model to ensure it matches the table structure
    await MyModel.sync();

    // Convert WKT to a MySQL geometry type
    console.log("data before insertion :7777777777777777   ", data.geom);
    //data.geom = wkx.Geometry.parse(data.geom).toWkb();
    //data.geom = fn('ST_GeomFromText', data.geom);    
    console.log(
      "data before insertion :99999999999999999999999999  ",
      data.geom  );

    console.log("attributes in sync.js: 10101010100101010010101010101010101", attributes);
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
    res.status(200).send("Synchronization successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Synchronization failed");
  }
});
module.exports = router;

