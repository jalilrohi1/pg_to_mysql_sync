const { ApiKey } = require("../models");

async function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.sendStatus(401);

  try {
    const key = await ApiKey.findOne({ where: { key: apiKey, active: true } });
    if (!key) return res.sendStatus(403);

    req.client = key.client;
    next();
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

module.exports = validateApiKey;
