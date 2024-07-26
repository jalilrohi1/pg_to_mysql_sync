const fs = require("fs");
require("dotenv").config();

try {
  const httpsOptions = {
    key: fs.readFileSync(process.env.HTTPS_KEY_PATH), //key: Reads the HTTPS key file from the path specified in the environment variable HTTPS_KEY_PATH.
    cert: fs.readFileSync(process.env.HTTPS_CERT_PATH), //Reads the HTTPS certificate file from the path specified in the environment variable HTTPS_CERT_PATH.
  };
  module.exports = httpsOptions;
} catch (error) {
  console.error("Failed to load HTTPS options:", error.message);
  process.exit(1); // Exit the process with an error code
}
