// Import the createSubscriber function from the pg-listen package. This function is used to create a new PostgreSQL LISTEN client.
const createPostgresSubscriber = require("pg-listen");
const axios = require("axios");
// Import the dotenv package and call its config function to load environment variables from a .env file into process.env.
require("dotenv").config();

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
    //console.log("Raw payload:", payload);

    const { operation, table, data: rowData } = payload;

    // Validate data before proceeding
    if (!["INSERT", "UPDATE", "DELETE"].includes(operation)) {
      throw new Error("Invalid operation");
    }
    if (!rowData || typeof rowData !== "object") {
      throw new Error("Invalid data format");
    }

    // Construct the URL
    const url = new URL(`${process.env.SYNC_URL}/sync`);
    console.log("Constructed URL:", url.toString());

    // Send a POST request to the /sync endpoint
    await axios.post(
      url.toString(),
      { operation, table, data: rowData },
      {
        headers: {
          Authorization: `Bearer ${process.env.JWT_SECRET}`,
          "x-api-key": process.env.API_KEY,
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
