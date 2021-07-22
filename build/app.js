"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passport = _interopRequireDefault(require("passport"));

var _logging = require("./logger/logging");

var _config = require("./config/config");

var _expressSession = _interopRequireDefault(require("express-session"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _game = require("./game/game");

var _api = require("./routes/api");

var _auth = require("./routes/auth");

var _logging2 = require("./middlewares/logging");

var _rules = require("./middlewares/rules");

var _errors = require("./middlewares/errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//NAMESPACE FOR logger
var NAMESPACE = "APP"; //create express server
//Express.js, or simply Express, is a back end web application framework for Node.js
//It is designed for building web applications and APIs. It has been called the de facto standard server

var app = (0, _express.default)(); //create instance of server
//ALL MIDDLEWARES - START
//configure session
//express-session is a middleware for express handling session setting and reading

var exp_sessions = (0, _expressSession.default)({
  secret: _config.config.mongo.secret,
  cookie: {
    httpOnly: false,
    sameSite: "none"
  },
  name: "buzz-words-session",
  secure: true,
  resave: false,
  saveUninitialized: false,
  store: new _connectMongo.default({
    mongoUrl: _config.config.mongo.url
  })
}); //SESSIONS

app.use(exp_sessions); //PASSPORT

app.use(_passport.default.initialize());
app.use(_passport.default.session()); //JSON body parsing

app.use(_express.default.json()); //REQUESTS / RESPONSES

app.use(_logging2.requestMiddleware); //CORS / RULES

app.use(_rules.rulesMiddleware); //ROUTES

app.use(_config.config.server.api_base, _api.apiRouter);
app.use("/", _auth.authRouter); //ERRORS

app.use(_errors.errorMiddleware); //ALL MIDDLEWARES - END
//runs express server and connects to database

var connect = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _mongoose.default.connect(_config.config.mongo.url, _config.config.mongo.options);

          case 3:
            _logging.logger.info(NAMESPACE, "Connected to mongoDB host: ".concat(_config.config.mongo.url));

            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);

            //ERROR log
            _logging.logger.error(NAMESPACE, "ERROR:", _context.t0);

          case 9:
            _context.prev = 9;
            //finally all good and ready to start listening on server
            srv = app.listen(_config.config.server.port, serverUp);
            return _context.finish(9);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 6, 9, 12]]);
  }));

  return function connect() {
    return _ref.apply(this, arguments);
  };
}(); //runs when server is up


var serverUp = function serverUp() {
  _logging.logger.info(NAMESPACE, "Server is running on: ".concat(_config.config.server.hostname, ":").concat(srv.address().port));

  _logging.logger.info(NAMESPACE, "Server API: ".concat(_config.config.server.hostname, ":").concat(srv.address().port).concat(_config.config.server.api_base));

  _logging.logger.info(NAMESPACE, "API Endpoint: \"/join\" METHOD: POST, Accepts: JSON => JSON");

  _logging.logger.info(NAMESPACE, "API Endpoint: \"/dict\" METHOD: POST, Accepts: JSON => JSON");

  _logging.logger.info(NAMESPACE, "API Endpoint: \"/rndletters/:size\" METHOD: GET, Accepts: query[number] => JSON");

  _logging.logger.info(NAMESPACE, "Server AUTH: ".concat(_config.config.server.hostname, ":").concat(srv.address().port, "/"));

  _logging.logger.info(NAMESPACE, "AUTH Endpoint: \"/login\" METHOD: POST, Accepts: JSON => JSON");

  _logging.logger.info(NAMESPACE, "AUTH Endpoint: \"/logout\" METHOD: GET, Accepts: null => null");
}; //entry point - initiates application
//We create global srv variable to be able to get back server object and read port
//If we supply port 0 in config - port would be assinged randomly (some hostings might require that) and it will get properly printed in console


var srv;
connect(); //initialise Game

_game.Game.loadDB();

_game.Game.initRooms();