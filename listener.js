const { createSubscriber } = require("pg-listen");
require("dotenv").config();

// PostgreSQL client setup
const subscriber = createSubscriber({
  connectionString: process.env.PG_DATABASE_URL,
});

subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error);
  process.exit(1);
});

// Listen for 'data_change' events
subscriber.notifications.on("data_change", async (payload) => {
  try {
    const data = JSON.parse(payload);
    const { operation, table, data: rowData } = data;

    // Validate data before proceeding
    if (!["INSERT", "UPDATE", "DELETE"].includes(operation)) {
      throw new Error("Invalid operation");
    }
    if (!rowData || typeof rowData !== "object") {
      throw new Error("Invalid data format");
    }

    // Send a POST request to the /sync endpoint
    const axios = require("axios");
    await axios.post(
      "https://your-domain.com/sync",
      { operation, table, data: rowData },
      {
        headers: {
          Authorization: `Bearer ${process.env.YOUR_JWT_TOKEN}`,
          "x-api-key": process.env.API_KEY, // Ensure the API key is sent along with the request
        },
      }
    );
    console.log("Sync request sent successfully");
  } catch (error) {
    console.error("Error processing data change notification:", error);
  }
});

// Connect to the database and start listening
async function start() {
  await subscriber.connect();
  await subscriber.listenTo("data_change");
  console.log("Listening for data change notifications...");
}

start();
