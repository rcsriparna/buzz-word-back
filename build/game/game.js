"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var _player = require("./player");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _player2 = require("../models/player");

var _logging = require("../logger/logging");

var _state = require("./state");

var _config = require("../config/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var debug = _config.config.debug;
var NAMESPACE = "GAME"; // (1 point)-A, E, I, O, U, L, N, S, T, R
// (2 points)-D, G
// (3 points)-B, C, M, P
// (4 points)-F, H, V, W, Y
// (5 points)-K
// (8 points)- J, X
// (10 points)-Q, Z
// GAME OBJECT SINGLETON

var Game = {
  _playersList: [],
  state: _state.State,
  timeOuts: [[], [], [], []],
  // METHODS
  initRooms: function initRooms() {
    if (debug) _logging.logger.info(NAMESPACE, "Initialising rooms");
    this.state.createRoom("GOLDEN", 4, 10, 30, _config.config.gridSize).addRound(0, 30);
    this.state.createRoom("SILVER", 4, 10, 45, _config.config.gridSize).addRound(1, 45);
    this.state.createRoom("BRONZE", 4, 10, 60, _config.config.gridSize).addRound(2, 60);
    this.state.createRoom("SINGLE", 1, 3, 30, _config.config.gridSize).addRound(3, 30);
  },
  processState: function processState() {
    var _this = this;

    var gamesStart = function gamesStart() {
      _this.gameRooms.forEach(function (room) {
        if (room.roomState == 0 && !room.hasSpace) {
          _this.startGame(room.roomId);
        }
      });
    };

    var roundsStart = function roundsStart() {
      _this.gameRooms.forEach(function (room) {
        if (room.roomState == 1) {
          var rounds = room.rounds;

          if (room.currentRound > 1) {
            var previousRound = rounds[room.currentRoundIndex - 1];
            var previousFinished = previousRound.finished;

            if (previousFinished) {
              _this.startRound(room.roomId);
            }
          }
        }
      });
    };

    gamesStart();
    roundsStart();
  },
  //helper function calculating total score based on preset scoring system
  calculateScore: function calculateScore(word) {
    var total = 0;

    for (var index = 0; index < word.length; index++) {
      var letter = word[index].toUpperCase();
      if ("AEIOULNSTR".includes(letter)) total += 1 * 5;else if ("DG".includes(letter)) total += 2 * 5;else if ("BCMP".includes(letter)) total += 3 * 5;else if ("FHVWY".includes(letter)) total += 4 * 5;else if ("K".includes(letter)) total += 5 * 5;else if ("JX".includes(letter)) total += 8 * 5;else total += 10;
    }

    total *= word.length;
    return total;
  },
  assembleWord: function assembleWord(letters) {
    var word = "";

    for (var key in letters) {
      var element = letters[key];
      word += element;
      letters[key] = this.getLetter(this.getRandomNumber(100));
    }

    return word;
  },
  startGame: function startGame(roomId) {
    if (debug) _logging.logger.info(NAMESPACE, "Starting game in room " + roomId);
    var room = this.getRoom(roomId);
    room.roomState = 1;
    this.startRound(roomId);
  },
  startRound: function startRound(roomId) {
    var room = this.getRoom(roomId);
    var round = room.getCurrentRoundObject();
    if (debug) _logging.logger.info(NAMESPACE, "Starting round ".concat(room.currentRound, " in room ").concat(roomId, " ").concat(room.roomName));

    if (round.startingIn == null) {
      round.startRound();
      var timeout = (room.roundDuration + 2 + 6) * 1000;
      this.timeOuts[roomId].push(setTimeout(this.finishRound.bind(this), timeout, roomId));
    }
  },
  finishRound: function finishRound(roomId) {
    var room = this.getRoom(roomId);
    var round = room.getCurrentRoundObject();
    if (debug) _logging.logger.info(NAMESPACE, "Finishing round ".concat(room.currentRound, " in room ").concat(roomId, " ").concat(room.roomName));

    if (!round.finished) {
      round.finished = true;
      round.endedAt = new Date();
      this.getRoundScore(roomId);
    }
  },
  getRoundScore: function getRoundScore(roomId) {
    var state = this.state;
    var room = this.getRoom(roomId);
    var round = room.getCurrentRoundObject();
    var players = room.players;
    var winner = [0, null, 0];
    if (debug) _logging.logger.info(NAMESPACE, "Calculating scores for round ".concat(room.currentRound, " in room ").concat(roomId, " ").concat(room.roomName));

    var _iterator = _createForOfIteratorHelper(players),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var player = _step.value;

        if (winner[0] <= (player === null || player === void 0 ? void 0 : player.scores[room.currentRoundIndex])) {
          winner[0] = player.scores[room.currentRoundIndex];
          winner[1] = player.words[room.currentRoundIndex];
          winner[2] = player.id;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    round.winner = winner[2];
    round.word = winner[1];

    if (!room.isLastRound) {
      this.timeOuts[roomId].push(setTimeout(state.addRound.bind(state), 5000, roomId));
      this.timeOuts[roomId].push(setTimeout(this.processState.bind(this), 5500));
    }

    if (room.isLastRound && round.finished) {
      room.winner = players.reduce(function (prev, current) {
        return prev.score > current.score ? prev : current;
      });
      this.finishGame(roomId);
    }

    this.processState();
  },
  finishGame: function finishGame(roomId) {
    var room = this.getRoom(roomId);
    room.roomState = 2;
    room.finishedAt = new Date();
    if (debug) _logging.logger.info(NAMESPACE, "Finishing game in room ".concat(roomId, " ").concat(room.roomName));
    this.timeOuts[roomId].push(setTimeout(room.reset.bind(room), 15000));
  },
  getLetter: function getLetter(perc) {
    //helper function to return random selected letters based on the probability system
    //http://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
    var thresholds = [0, 12.02, 21.12, 29.24, 36.92, 44.23, 51.18, 57.46, 63.48, 69.4, 73.72, 77.7, 80.58, 83.29, 85.9, 88.2, 90.31, 92.4, 94.43, 96.25, 97.74, 98.85, 99.54, 99.71, 99.82, 99.92, 100.0];
    var letters = "ETAOINSRHDLUCMFYWGPBVKXQJZ";

    var _iterator2 = _createForOfIteratorHelper(letters.split("").entries()),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            i = _step2$value[0],
            l = _step2$value[1];

        if (perc > thresholds[i] && perc <= thresholds[i + 1]) return letters[i];
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  },
  generateLetters: function generateLetters(size) {
    var letters = [];

    for (var i = 0; i < size; i++) {
      letters.push(this.getLetter(this.getRandomNumber(100)));
    }

    return letters;
  },
  //helper function returning random number within given range
  getRandomNumber: function getRandomNumber(max) {
    return Math.random() * max;
  },
  getRoom: function getRoom(roomId) {
    return this.gameRooms[roomId];
  },
  markActive: function markActive(id) {
    this.playersList.forEach(function (player) {
      if (player.id == id) player.active = true;
    });
  },
  markOffline: function markOffline(username) {
    var _this2 = this;

    this.playersList.forEach(function (player) {
      if (player.name == username) {
        player.active = false;

        _this2.state.removePlayer(player);
      }
    });
  },
  // ASYNC METHODS
  loadDB: function loadDB() {
    var _this3 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var allPlayers;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _player2.PlayerModel.find();

            case 2:
              allPlayers = _context.sent;
              allPlayers.forEach(function (player) {
                return _this3._playersList.push({
                  name: player.name,
                  score: player.score,
                  id: player.id,
                  active: false
                });
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  addPlayer: function addPlayer(roomId, player) {
    var _this4 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this4.state.addPlayer(roomId, player);

            case 2:
              response = _context2.sent;

              _this4.processState();

              return _context2.abrupt("return", response);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  getUserByID: function getUserByID(id) {
    var _this5 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", _this5._playersList.find(function (p) {
                return p.id == id;
              }));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  checkWord: function checkWord(letters, user) {
    var _this6 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var player, word, now, response, room;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this6.getUserByID(user._id);

            case 2:
              player = _context4.sent;
              word = _this6.assembleWord(letters);
              now = new Date();
              _context4.next = 7;
              return (0, _nodeFetch.default)("https://api.dictionaryapi.dev/api/v2/entries/en_GB/".concat(word));

            case 7:
              response = _context4.sent;
              _context4.next = 10;
              return response.json();

            case 10:
              response = _context4.sent;

              if (response.title) {
                response.score = 0;
                response.match = false;
                response.letters = letters;
              } else {
                response = response[0];
                response.score = _this6.calculateScore(response.word);
                response.match = true;
                response.letters = letters;
              }

              if (debug) _logging.logger.info(NAMESPACE, "Calculating points for word ".concat(response.word, " from player ").concat(player.name));
              room = _this6.gameRooms[player.room];
              response.score += response.score !== 0 ? parseInt(30 - (now - room.getCurrentRoundObject().startedAt) / 1000) : 0;
              user.score += response.score;
              player.score += response.score;
              room.players.forEach(function (p) {
                if (p.id == player.id) {
                  p.scores[room.currentRound - 1] = response.score;
                  p.score += response.score;
                  p.words[room.currentRound - 1] = response;
                  p.recievedAt = now;
                }
              });

              _this6.playersList.forEach(function (player) {
                if (player.name == user.username) player.score += response.score;
              });

              response.winner = user.username;
              user.save();
              return _context4.abrupt("return", response);

            case 22:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  },
  createPlayer: function createPlayer(newPlayer) {
    var _this7 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var player;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              player = null;
              _context5.next = 3;
              return _player2.PlayerModel.findOne({
                username: newPlayer.username
              });

            case 3:
              player = _context5.sent;

              if (!player) {
                _context5.next = 9;
                break;
              }

              _logging.logger.warn(NAMESPACE, "User ".concat(newPlayer.username, " already exists. Either login or choose different name."));

              return _context5.abrupt("return", null);

            case 9:
              player = new _player2.PlayerModel({
                username: newPlayer.username,
                name: newPlayer.username,
                score: 0
              });
              _context5.next = 12;
              return player.setPassword(newPlayer.password);

            case 12:
              _context5.next = 14;
              return player.save();

            case 14:
              _this7._playersList.push((0, _player.Player)(newPlayer.username, player.id));

              _logging.logger.warn(NAMESPACE, "User ".concat(newPlayer.username, " created sucesfully."), _this7.lastPlayer);

              return _context5.abrupt("return", player);

            case 17:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))();
  },
  getPlayer: function getPlayer(username) {
    var _this8 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
      var player;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              console.log(username);
              player = _this8._playersList.find(function (p) {
                return p.name == username;
              });
              return _context6.abrupt("return", player);

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }))();
  },

  // GETTERS
  get gameRooms() {
    return this.state.gameRooms;
  },

  get lastPlayer() {
    return this.playersList[this.playersList.length - 1];
  },

  get topPlayer() {
    return this._playersList.reduce(function (prev, current) {
      return prev.score > current.score ? prev : current;
    });
  },

  get playersList() {
    return this._playersList;
  }

};
exports.Game = Game;