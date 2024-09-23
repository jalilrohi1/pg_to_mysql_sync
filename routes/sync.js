const authenticateToken = require("../middleware/auth");
const validateApiKey = require("../middleware/apiKey");
const testConnection = require("../middleware/testmysqlconnection");
const synctomysql = require("../middleware/synctomyysql");
const deleteTextFiles = require("../middleware/deletetextfiles");

const path = require("path");
const express = require("express");
const router = express.Router();

const logDir = path.join(process.cwd(), "datalog"); // Define the path to the datalog folder

router.post("/",authenticateToken,validateApiKey,testConnection,synctomysql,deleteTextFiles(logDir),(req, res) => {
    res.status(200).send("Synchronization successful");
  }
);

// New route to manually trigger syncrout
router.get("/trigger-synctomysql",testConnection,synctomysql,deleteTextFiles(logDir),async (req, res) => {
    res.status(200).send("Synchronization successful");
  }
);
module.exports = router;
