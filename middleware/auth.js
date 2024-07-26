const jwt = require("jsonwebtoken");
require("dotenv").config();

// Define a function named authenticateToken. This function is middleware for Express.js to authenticate tokens.
const authenticateToken = (req, res, next) => {
  // Retrieve the token from the "authorization" header of the incoming request.
  const token = req.headers["authorization"]; //?.split(" ")[1]; // Assuming "Bearer token"
  console.log(`Received JWT: ${token}`);
  console.log(`Orignal JWT : ${process.env.JWT_SECRET}`);
  // If no token is provided, return a 401 Unauthorized status code.
  if (!token) return res.status(401).send("Unauthorized: No token provided");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Use the jwt.verify method to validate the token with the secret stored in JWT_SECRET environment variable.
    if (err) return res.sendStatus(403); // If there's an error during verification (e.g., token is invalid), return a 403 Forbidden status code.
    req.user = user; // If the token is valid, attach the decoded user information to the request object.
    next(); // Call the next middleware function in the stack.
  });
};
// function authenticateToken(req, res, next) {
//   const token = req.headers["authorization"];
//   console.log(`Received JWT: ${token}`);

//   if (token == null) return res.sendStatus(401);

//   // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//   //   if (err) return res.sendStatus(403);
//   //   req.user = user;
//   //   next();
//   // });
//   next();
// }

module.exports = authenticateToken;

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]?.trim();

//   console.log(`Received JWT: '${token}'`);
//   console.log(`Original JWT Secret: '${process.env.JWT_SECRET}'`);

//   if (!token) return res.status(401).send("Unauthorized: No token provided");

//   // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//   //   if (err) {
//   //     console.error("JWT Verification Error:", err);
//   //     return res.status(401).send("Unauthorized: Invalid token");
//   //   }
//   //   console.log("Decoded Token:", decoded);
//   //   req.user = decoded; // Save user information from token in request object
//   next();
//   // });
// };
