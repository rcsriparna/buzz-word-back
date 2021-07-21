"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRouter = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _express = _interopRequireWildcard(require("express"));

var _config = require("../config/config");

var _game = require("../game/game");

var _path = _interopRequireDefault(require("path"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var timesyncServer = require("timesync/server"); //router for "/..." route


var authRouter = (0, _express.Router)(); // authRouter.use(express.static("./assets", { root: __dirname }));

exports.authRouter = authRouter;
authRouter.use("/".concat(_config.config.front.static), _express.default.static(_path.default.join(__dirname, "../../".concat(_config.config.front.root, "/").concat(_config.config.front.static))));
authRouter.get(["/", "/*.html"], function (req, res) {
  if (req.path == "/") res.sendFile("index.html", {
    root: _path.default.join(__dirname, "../../".concat(_config.config.front.root, "/"))
  });else if (req.path.includes("html")) res.sendFile(req.path, {
    root: _path.default.join(__dirname, "../../".concat(_config.config.front.root, "/"))
  });
});
authRouter.use("/timesync", timesyncServer.requestHandler); //logout

authRouter.get("/logout", function (req, res) {
  _game.Game.markOffline(req.session.passport.user);

  req.logout();
  res.status(_config.config.http.OK);
  res.send();
}); //logged

authRouter.get("/logged", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var msg;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.user) {
              _context.next = 9;
              break;
            }

            _context.next = 3;
            return _game.Game.getPlayer(req.user.username);

          case 3:
            res.locals.data = _context.sent;

            _game.Game.markActive(res.locals.data.id);

            res.status(_config.config.http.OK);
            res.json(res.locals.data);
            _context.next = 13;
            break;

          case 9:
            res.status(_config.config.http.NOT_FOUND);
            msg = "User ".concat(req.body.username, " already exists. Either login or choose different name.");
            res.locals.data = {
              message: msg
            };
            res.json(res.locals.data);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); //custom middleware handler for creating player from within game object [Class GameState]

authRouter.post("/signup", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.user) req.logout();
            _context3.next = 3;
            return _game.Game.createPlayer(req.body);

          case 3:
            res.locals.data = _context3.sent;

            if (!res.locals.data) {
              _context3.next = 11;
              break;
            }

            req.logIn(res.locals.data, /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(errLogIn) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!errLogIn) {
                          _context2.next = 2;
                          break;
                        }

                        return _context2.abrupt("return", next(errLogIn));

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x6) {
                return _ref3.apply(this, arguments);
              };
            }());
            _context3.next = 8;
            return _game.Game.getPlayer(res.locals.data.username);

          case 8:
            res.locals.data = _context3.sent;
            _context3.next = 13;
            break;

          case 11:
            res.status(_config.config.http.BAD_REQUEST);
            res.locals.data = {
              message: "User ".concat(req.body.username, " already exists. Either login or choose different name.")
            };

          case 13:
            res.json(res.locals.data);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()); //login POST with username and password in body

authRouter.post("/login", _passport.default.authenticate("local"), /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _game.Game.getPlayer(req.body.username);

          case 2:
            res.locals.data = _context4.sent;

            _game.Game.markActive(res.locals.data.id);

            res.status(_config.config.http.OK);
            res.json(res.locals.data);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());