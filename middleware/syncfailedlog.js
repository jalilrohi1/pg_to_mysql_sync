const fs = require("fs");
const path = require("path");

// Ensure the datalog directory exists in the root folder
const logDir = path.join(process.cwd(), "syncfialedlog");
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
async function syncfailedlog(fsyndata) {
  const logFilePath = path.join(logDir, getLogFileName());
  //console.log("Log Entries:", fsyndata);
  console.log(
    "Log Failed Entries: sysncfailedlog.js and loging it to file again"
  );
  // Convert each object to a JSON string and join them with newlines
  const logEntries = fsyndata.map((entry) => JSON.stringify(entry)).join("\n");

  // Write the log entries to the file
  fs.appendFile(logFilePath, logEntries + "\n", (err) => {
    if (err) {
      console.error("Failed to log data change:", err);
      return false; // Call next with error to handle it
    }
    return true; // Continue to the next middleware or function
  });
}
module.exports = syncfailedlog;
