const fs = require("fs");
const path = require("path");

const deleteTextFiles = (folderPath) => {
  return (req, res, next) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error("Unable to scan directory:", err);
        return next(err);
      }

      files.forEach((file) => {
        if (path.extname(file) === ".txt") {
          fs.unlink(path.join(folderPath, file), (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log(`Deleted file: ${file}`);
            }
          });
        }
      });

      next(); // Proceed to the next middleware or route handler
    });
  };
};

module.exports = deleteTextFiles;
