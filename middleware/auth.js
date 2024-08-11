const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  user = jwt.verify(token, process.env.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
}
module.exports = authenticateToken;
