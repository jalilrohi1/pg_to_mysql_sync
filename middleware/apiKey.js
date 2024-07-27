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
//  //This line defines an asynchronous function named validateApiKey. It takes three parameters: req (the request object), res (the response object), and next (a callback function to pass control to the next middleware function).
// async function validateApiKey(req, res, next) {
//    const apiKey = req.headers["x-api-key"]; // This line extracts the API key from the request headers. It looks for a header named x-api-key.
//   if (!apiKey) return res.sendStatus(401); //If no API key is found in the headers, the function immediately responds with a 401 status code, indicating that authentication is required.

//   try {
//     //This line asynchronously searches for an API key in the database that matches the provided API key and is marked as active. ApiKey is a model imported from another module, presumably representing an API key entity in a database.
//     const key = await ApiKey.findOne({
//       where: { uniquekey: apiKey, active: true },
//     });
//     // If no matching active API key is found in the database, the function responds with a 403 status code, indicating that the request is forbidden.
//     if (!key) return res.sendStatus(403);
//     //This line assigns the client information associated with the API key to the req object, so it can be used in subsequent middleware or route handlers.
//     req.client = key.client;
//     //This line calls the next callback function, passing control to the next middleware function in the stack.
//     next();
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500); //This line sends a 500 status code response, indicating an internal server error.
//   }
// }
