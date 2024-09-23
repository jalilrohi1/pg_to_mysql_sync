// Import the createSubscriber function from the pg-listen package. This function is used to create a new PostgreSQL LISTEN client.
const createPostgresSubscriber = require("pg-listen");
const axios = require("axios");
// Import the dotenv package and call its config function to load environment variables from a .env file into process.env.
require("dotenv").config();
const logToFile = require("./middleware/logToFile");
retryInterval=5*60*1000; // 1 minute
//// Create a new subscriber instance by calling createSubscriber with a configuration object. The configuration object contains the connectionString property, which is set to the value of the PG_DATABASE_URL environment variable. This environment variable should contain the connection string to the PostgreSQL database.
const subscriber = createPostgresSubscriber({
  connectionString: process.env.PG_DATABASE_URL,
});
// Listen for the 'error' event on the subscriber's events EventEmitter. If an error event occurs, log the error message and exit the process with a status code of 1, indicating an error.
subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error);
  process.exit(1);
});

// Listen for 'data_change' events
subscriber.notifications.on("data_change", async (payload) => {
  try {
    // Log the raw payload once
    console.log("Raw payload on listener:", payload);

    const { operation, table, data: rowData, primaryKeycol } = payload;

    // Validate data before proceeding
    if (!["INSERT", "UPDATE", "DELETE"].includes(operation)) {
      throw new Error("Invalid operation");
    }
    if (!rowData || typeof rowData !== "object") {
      throw new Error("Invalid data format");
    }

    // Define a mock response object
    const res = {};

    // Define the next function as async
    const next = async (error) => {
      if (error) {
        console.error("Error in middleware:", error);
      } else {
        // If no error, proceed with syncing to the MySQL service
        if (process.env.Mode === "automatic") {
          await syncData();
        } else if (process.env.Mode === "auto-check") {
          console.log("Data change logged. Waiting for sync... it will be retried every 5 minutes");
          // Retry every 5 minutes if in auto-check mode
            setInterval(syncData, retryInterval);
        }
      }
    };

    // Call the logToFile middleware
    await logToFile({ body: { operation, table, data: rowData, primaryKeycol } }, res, next);
    
  } catch (error) {
    console.error("Error processing data change notification:", error);
  }
});

// Sync to MySQL service after logging
async function syncData() {
  try {
    const url = new URL(`${process.env.SYNC_URL}/sync`);
    const httpsAgent = new (require("https").Agent)({
      rejectUnauthorized: false, // Disable SSL verification for development purposes
    });

    // Send data to the sync service
    await axios.post(url.toString(),{},{
        headers: {
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
          "x-api-key": process.env.API_KEY,
        },
        httpsAgent:
          process.env.NODE_ENV !== "production" ? httpsAgent : undefined,
      }
    );
    console.log("Data synced successfully to MySQL");
  } catch (error) {
    console.error("Error syncing data to MySQL:", error);
  }
}

// Connect to the database and start listening
async function start() {
  await subscriber.connect();
  await subscriber.listenTo("data_change");
  console.log("Listening for data change notifications...");
}
start();
