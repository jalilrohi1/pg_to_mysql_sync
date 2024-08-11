const { ApiKey } = require("../models");
require("dotenv").config();

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).send("Forbidden: Invalid API Key");
  }
};
module.exports = validateApiKey;
