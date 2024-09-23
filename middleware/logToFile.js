const fs = require("fs");
const path = require("path");

// Ensure the datalog directory exists in the root folder
const logDir = path.join(process.cwd(), "datalog");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Function to get the current log file name based on the date
function getLogFileName() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `log-${year}-${month}-${day}.txt`;
}

// Middleware function to log data to a file
async function logToFile(req, res, next) {
  const logFilePath = path.join(logDir, getLogFileName());
  const { operation, table, data, primaryKeycol } = req.body;

  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    table,
    primaryKeycol,
    data,
  };

  // Write the log entry to the file
  fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
    if (err) {
      console.error("Failed to log data change:", err);
      return next(err); // Call next with error to handle it
    }
    //console.log("Logged data change to file:", logEntry);
    next(); // Continue to the next middleware or function
  });
}
module.exports = logToFile;
