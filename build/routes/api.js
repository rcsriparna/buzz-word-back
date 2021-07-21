"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiRouter = void 0;

require("babel-polyfill");

var _express = require("express");

var _game = require("../game/game");

var _config = require("../config/config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//router for "/api..." route
var apiRouter = (0, _express.Router)(); //custom middleware handling 'word checking' in external API accessed from within game object [Class GameState]

exports.apiRouter = apiRouter;

var checkWord = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.user) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return _game.Game.checkWord(req.body.letters, req.user);

          case 3:
            res.locals.data = _context.sent;
            res.status(_config.config.http.CREATED);
            _context.next = 8;
            break;

          case 7:
            res.status(_config.config.http.UNAUTHORIZED);

          case 8:
            next();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function checkWord(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(); //custom middleware handler for generating random letters accessed from within game object [Class GameState]


var generateLetters = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.user) {
              res.locals.data = _game.Game.generateLetters(req.params.size);
              res.status(_config.config.http.CREATED);
            } else res.status(_config.config.http.UNAUTHORIZED);

            next();

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function generateLetters(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}(); //custom middleware handler for returning game status from within game object [Class GameState]


var gameState = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (req.user) {
              res.locals.data = _game.Game.state;
            } else res.status(_config.config.http.UNAUTHORIZED);

            next();

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function gameState(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}(); //custom middleware handler for returning game status from within game object [Class GameState]


var joinRoom = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var player;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!req.user) {
              _context4.next = 10;
              break;
            }

            _context4.next = 3;
            return _game.Game.getUserByID(req.user._id);

          case 3:
            player = _context4.sent;
            _context4.next = 6;
            return _game.Game.addPlayer(req.body.roomId, player);

          case 6:
            res.locals.data = _context4.sent;
            if (res.locals.data) res.status(_config.config.http.CREATED);else {
              res.status(_config.config.http.BAD_REQUEST);
              res.locals.data = {
                message: "User ".concat(player.name, " already in the room.")
              };
            }
            _context4.next = 11;
            break;

          case 10:
            res.status(_config.config.http.UNAUTHORIZED);

          case 11:
            next();

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function joinRoom(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}(); //middleware handler - responsible for returning response as JSON


var outputResponse = function outputResponse(req, res, next) {
  res.json(res.locals.data);
}; //two end-points handling API requests


apiRouter.post("/dict", checkWord, outputResponse);
apiRouter.get("/rndletters/:size", generateLetters, outputResponse);
apiRouter.get("/state", gameState, outputResponse);
apiRouter.post("/room", joinRoom, outputResponse);