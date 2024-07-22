const express = require("express");
const { pgSequelize, mysqlSequelize } = require("./config/database");
const httpsOptions = require("./config/https");
const syncRouter = require("./routes/sync");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for security headers
const helmet = require("helmet");
app.use(helmet());

// Middleware for JSON parsing
app.use(express.json());

// Use the synchronization route
app.use("/sync", syncRouter);

// Start the server
pgSequelize.sync().then(() => {
  mysqlSequelize.sync().then(() => {
    const https = require("https");
    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`Secure server listening on port ${port}`);

      // Start the PostgreSQL listener
      require("./listener");
    });
  });
});
