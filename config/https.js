const fs = require("fs");
require("dotenv").config();

const httpsOptions = {
  key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
  cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
};

module.exports = httpsOptions;
