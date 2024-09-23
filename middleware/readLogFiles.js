const fs = require("fs");
const path = require("path");
// Example using PostgreSQL

// Ensure the datalog directory exists in the root folder
const logDir = path.join(process.cwd(), "datalog");
// Function to read log files and parse JSON data
async function readLogFiles() {
  const files = fs.readdirSync(logDir);
  let logEntries = [];

  for (const file of files) {
    if (file.endsWith(".txt")) {
      const filePath = path.join(logDir, file);
      const data = fs.readFileSync(filePath, "utf8");
      const entries = data
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line));
      logEntries = logEntries.concat(entries);
    }
  }

  return logEntries;
}
module.exports = readLogFiles;
