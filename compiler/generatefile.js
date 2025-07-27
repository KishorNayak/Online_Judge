const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
  fs.mkdirSync(dirCode, { recursive: true });
}

const generatefile = (format, content) => {
  const jobId = uuidv4();
  const filename = `${jobId}.${format}`;
  const filepath = path.join(dirCode, filename);
  fs.writeFileSync(filepath, content);
  return filepath;
};

module.exports = { generatefile };