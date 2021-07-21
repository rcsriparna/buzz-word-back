"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rulesMiddleware = void 0;

var _config = require("../config/config");

var _logging = require("../logger/logging");

var NAMESPACE = "CORS"; // API RULES | OPTIONS | CORS etc...

var rulesMiddleware = function rulesMiddleware(req, res, next) {
  if (req.url == "/api/state" && req.url != "/timesync") {
    res.header("Access-Control-Allow-Origin", _config.config.debug ? "*" : _config.config.server.hostname);
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");

    _logging.logger.info(NAMESPACE, "[REQ-HEADERS] User-Agent: ".concat(req.get("User-Agent")));

    _logging.logger.info(NAMESPACE, "[REQ-HEADERS] Access-Control-Allow-Origin: ".concat(res.get("Access-Control-Allow-Origin")));

    _logging.logger.info(NAMESPACE, "[REQ-HEADERS] Access-Control-Allow-Headers: ".concat(res.get("Access-Control-Allow-Headers")));

    _logging.logger.info(NAMESPACE, "[REQ-HEADERS] Access-Control-Allow-Credentials: ".concat(res.get("Access-Control-Allow-Credentials")));

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");

      _logging.logger.info(NAMESPACE, "[RES-HEADERS] Access-Control-Allow-Methods: ".concat(res.get("Access-Control-Allow-Methods")));

      return res.status(200).send();
    }

    res.on("finish", function () {
      var msg = [res.get("Content-Type"), req.url, req.socket.remoteAddress, res.statusCode];

      _logging.logger.info(NAMESPACE, "[RES-HEADERS] Content-Type: ".concat(msg[0]));

      _logging.logger.info(NAMESPACE, "[RES-HEADERS] URL: ".concat(msg[1]));

      _logging.logger.info(NAMESPACE, "[RES-HEADERS] IP: ".concat(msg[2]));

      _logging.logger.info(NAMESPACE, "[RES-HEADERS] STATUS: ".concat(msg[3]));
    });
  }

  next();
};

exports.rulesMiddleware = rulesMiddleware;