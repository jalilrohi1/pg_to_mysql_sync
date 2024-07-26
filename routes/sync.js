const express = require("express");
const { PgModel, MysqlModel } = require("../models");
const authenticateToken = require("../middleware/auth");
const validateApiKey = require("../middleware/apiKey");
const router = express.Router();

router.post("/", authenticateToken, validateApiKey, async (req, res) => {
  const { operation, data } = req.body;

  try {
    if (operation === "INSERT" || operation === "UPDATE") {
      await MysqlModel.upsert(data);
    } else if (operation === "DELETE") {
      await MysqlModel.destroy({ where: { id: data.id } });
    }

    res.status(200).send("Synchronization successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Synchronization failed");
  }
});

module.exports = router;
