const fs = require("fs");
const path = require("path");

const getTimeStamp = () => new Date().toISOString();

const log_file = fs.createWriteStream(path.resolve(__dirname, "../debug.log"), { flags: "w" });

const log = (type, namespace, message, object = {}) => {
  let msg = `[${getTimeStamp()}] [${type}] [${namespace}] ${message}`;
  if (type == "INFO") console.info(msg);
  if (type == "WARN") console.warn(msg);
  if (type == "DEBUG") console.debug(msg);
  if (type == "ERROR") console.error(msg);
  if (object) {
    msg += `${JSON.stringify(object, null, 2)}`;
    console.dir(object);
  }
  log_file.write(msg + "\n");
};

const info = (namespace, message, object = {}) => log("INFO", namespace, message, object);
const warn = (namespace, message, object = {}) => log("WARN", namespace, message, object);
const debug = (namespace, message, object = {}) => log("DEBUG", namespace, message, object);
const error = (namespace, message, object = {}) => log("ERROR", namespace, message, object);

module.exports = {
  info,
  warn,
  error,
  debug,
};
