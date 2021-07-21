"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMiddleware = void 0;

var _logging = require("../logger/logging");

var NAMESPACE = "MIDDLEWARE Errors"; // ERROR HANDLING

var errorMiddleware = function errorMiddleware(err, req, res, next) {
  _logging.logger.error(NAMESPACE, "ERROR:", err);

  res.status(500).json({
    message: err.message
  });
};

exports.errorMiddleware = errorMiddleware;