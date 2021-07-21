"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = void 0;

var _colours = require("./colours");

var fs = require("fs");

var path = require("path");

var getTimeStamp = function getTimeStamp() {
  return new Date().toISOString();
};

var log_file = fs.createWriteStream(path.resolve(__dirname, "../debug.log"), {
  flags: "w"
});

var log = function log(type, namespace, message) {
  var object = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var msg = "[".concat(getTimeStamp(), "] [").concat(type, "] [").concat(namespace, "] ").concat(message);
  if (type == "INFO") console.info((0, _colours.parseMsgAndColour)(msg));
  if (type == "WARN") console.warn((0, _colours.parseMsgAndColour)(msg));
  if (type == "DEBUG") console.debug((0, _colours.parseMsgAndColour)(msg));
  if (type == "ERROR") console.error((0, _colours.parseMsgAndColour)(msg));

  if (object) {
    msg += "\n    \n".concat(object.constructor.name, ":\n    \n").concat(JSON.stringify(object, null, 2));
    console.dir(object);
  }

  log_file.write(msg + "\n");
};

var logger = {
  info: function info(namespace, message, object) {
    return log("INFO", namespace, message, object);
  },
  warn: function warn(namespace, message, object) {
    return log("WARN", namespace, message, object);
  },
  debug: function debug(namespace, message, object) {
    return log("DEBUG", namespace, message, object);
  },
  error: function error(namespace, message, object) {
    return log("ERROR", namespace, message, object);
  }
};
exports.logger = logger;