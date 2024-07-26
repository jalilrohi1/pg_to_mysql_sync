const { createSubscriber } = require("pg-listen");
require("dotenv").config();

// PostgreSQL client setup
const subscriber = createSubscriber({
  connectionString: process.env.PG_DATABASE_URL,
});

// Handle database connection errors
subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error);
  process.exit(1);
});

// Handle data change notifications
subscriber.notifications.on("data_change", async (payload) => {
  try {
    // Parse the payload
    const data = JSON.parse(payload);
    const { operation, table, data: rowData } = data;

    // Validate the payload
    if (!["INSERT", "UPDATE", "DELETE"].includes(operation)) {
      throw new Error("Invalid operation");
    }
    if (!rowData || typeof rowData !== "object") {
      throw new Error("Invalid data format");
    }

    // Prepare request headers
    const axios = require("axios");
    const headers = {
      Authorization: `Bearer ${process.env.JWT_SECRET}`, // JWT for authentication
      "x-api-key": process.env.API_KEY, // API Key for access
    };

    // Send a POST request to the /sync endpoint
    await axios.post(
      `${process.env.SYNC_URL}/sync`,
      { operation, table, data: rowData },
      { headers }
    );

    console.log("Sync request sent successfully");
  } catch (error) {
    console.error("Error processing data change notification:", error);
  }
});

// Connect to the database and start listening for notifications
async function start() {
  try {
    await subscriber.connect();
    await subscriber.listenTo("data_change");
    console.log("Listening for data change notifications...");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

start();
