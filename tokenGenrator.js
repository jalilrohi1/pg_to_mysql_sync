const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign(
  { user_id: 123, role: "admin" }, // Payload
  process.env.JWT_SECRET, // Secret from .env
  { expiresIn: "1h" } // Options
);

console.log(`Generated Token: ${token}`);
