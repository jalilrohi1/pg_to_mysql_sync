const express = require("express"); // Import the express module to create an HTTP server.
const { pgSequelize, mysqlSequelize } = require("./config/database"); // Import Sequelize instances for PostgreSQL and MySQL from a local configuration file.
const httpsOptions = require("./config/https"); // Import HTTPS options (like SSL certificates) for creating an HTTPS server.
const syncRouter = require("./routes/sync"); // Import the router for the synchronization endpoint from the routes directory.
const https = require("https"); // Import the https module to create an HTTPS server.

require("dotenv").config();
// const https = require("https"); // Import the https module

const app = express(); // Create an Express application.

const port = process.env.PORT || 3000; // Determine the port to listen on from an environment variable or default to 3000.

// Middleware for security headers
const helmet = require("helmet"); // Import the helmet module for setting HTTP headers for security.
app.use(helmet()); // Use helmet middleware in the Express app to enhance security.



// Middleware for JSON parsing
app.use(express.json()); // Use the built-in middleware in Express to parse incoming requests with JSON payloads.

// Use the synchronization route
app.use("/sync", syncRouter); // Mount the syncRouter on the '/sync' path.

// Start the server
pgSequelize.sync().then(() => {
  // Synchronize the PostgreSQL database using Sequelize. This ensures that the database schema matches the models defined in the application.
  mysqlSequelize.sync().then(() => {
    // After synchronizing the PostgreSQL database, synchronize the MySQL database.
    https.createServer(httpsOptions, app).listen(3000, () => { // Create an HTTPS server with the specified options and the Express app, then listen on the specified port.
   // app.listen(port, () => {
      console.log(`Server listening on port ${port}`);

      // Start the PostgreSQL listener
      require("./listener"); // Import and execute the listener module, which starts listening for PostgreSQL notifications.
    });
  });
});
