const fs = require("fs");
const path = require("path");
import { parseMsgAndColour } from "./colours";

const getTimeStamp = () => new Date().toISOString();

const log_file = fs.createWriteStream(path.resolve(__dirname, "../debug.log"), { flags: "w" });

const log = (type, namespace, message, object = null) => {
  let msg = `[${getTimeStamp()}] [${type}] [${namespace}] ${message}`;
  if (type == "INFO") console.info(parseMsgAndColour(msg));
  if (type == "WARN") console.warn(parseMsgAndColour(msg));
  if (type == "DEBUG") console.debug(parseMsgAndColour(msg));
  if (type == "ERROR") console.error(parseMsgAndColour(msg));
  if (object) {
    msg += `
    \n${object.constructor.name}:
    \n${JSON.stringify(object, null, 2)}`;
    console.dir(object);
  }
  log_file.write(msg + "\n");
};

export const logger = {
  info: (namespace, message, object) => log("INFO", namespace, message, object),
  warn: (namespace, message, object) => log("WARN", namespace, message, object),
  debug: (namespace, message, object) => log("DEBUG", namespace, message, object),
  error: (namespace, message, object) => log("ERROR", namespace, message, object),
};
