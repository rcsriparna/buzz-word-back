"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestMiddleware = void 0;

var _logging = require("../logger/logging");

var NAMESPACE = "HTTP"; //REQUEST LOGGING SESSION/REQUEST

var requestMiddleware = function requestMiddleware(req, res, next) {
  if (req.url != "/api/state" && req.url != "/timesync") {
    _logging.logger.info(NAMESPACE, "METHOD - [".concat(req.method, "]"));

    _logging.logger.info(NAMESPACE, "URL - [".concat(req.url, "]"));

    _logging.logger.info(NAMESPACE, "IP - [".concat(req.socket.remoteAddress, "]"));

    _logging.logger.info(NAMESPACE, "SESSION-ID - [".concat(req.session.id, "]"));

    _logging.logger.info(NAMESPACE, "COOKIE:", req.session.cookie);
  }

  next();
};

exports.requestMiddleware = requestMiddleware;