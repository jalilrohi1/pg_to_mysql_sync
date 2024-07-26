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

// Listen for 'data_change' events on the subscriber's notifications EventEmitter. When a data_change event is received, the callback function is executed with the payload of the event.
subscriber.notifications.on("data_change", async (payload) => {
  try {
    // Log the raw payload once
    console.log("Raw payload:", payload);

    // Log environment variables
    console.log("SYNC_URL:", process.env.SYNC_URL);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("API_KEY:", process.env.API_KEY);

    // Parse the payload from a JSON string into an object. The payload is expected to contain information about the database operation, the table affected, and the data involved.
    // const data = JSON.parse(payload);
    // Destructure the operation, table, and data properties from the parsed payload object.
    const { operation, table, data: rowData } = data;

    // Validate the operation to ensure it is one of INSERT, UPDATE, or DELETE. If not, throw an error.
    if (!["INSERT", "UPDATE", "DELETE"].includes(operation)) {
      throw new Error("Invalid operation");
    }
    // Validate the rowData to ensure it is an object. If not, throw an error.
    if (!rowData || typeof rowData !== "object") {
      throw new Error("Invalid data format");
    }

    // Construct the URL
    const url = new URL(`${process.env.SYNC_URL}/sync`);
    console.log("Constructed URL:", url.toString());

    // Send a POST request to the /sync endpoint of your-domain.com. Include the operation, table, and rowData in the request body. Also, set the Authorization and x-api-key headers using values from environment variables.
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

// Define an asynchronous start function that connects the subscriber to the database and starts listening for data_change events.
async function start() {
  await subscriber.connect(); // Connect to the PostgreSQL database.
  await subscriber.listenTo("data_change"); // Start listening for data_change events.
  console.log("Listening for data change notifications..."); // Log a message indicating that the subscriber is now listening for data_change notifications.
}

// Call the start function to connect to the database and start listening for data_change events.
start();
