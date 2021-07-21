"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.State = void 0;

var _game = require("./game");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var State = {
  roomStates: {
    0: "AWAITING PLAYERS",
    1: "GAME IN PROGRESS",
    2: "GAME FINISHED"
  },
  gameRooms: [],
  createRoom: function createRoom(roomName, maxMembers, roundsTotal, roundDuration, gridSize) {
    this.gameRooms.push({
      //ROOM PROPERTIES / KEYS
      roomName: roomName,
      maxMembers: maxMembers,
      roundsTotal: roundsTotal,
      roundDuration: roundDuration,
      gridSize: gridSize,
      players: [],
      rounds: [],
      roomState: 0,
      roomId: this.gameRooms.length,
      winner: null,
      //ROOM METHODS
      isInRoom: function isInRoom(player) {
        var _iterator = _createForOfIteratorHelper(this.players),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var p = _step.value;
            if (String(p.id) === String(player.id)) return true;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return false;
      },
      addPlayer: function addPlayer(player) {
        this.players.push(player);
      },
      removePlayer: function removePlayer(player) {
        this.players = this.players.filter(function (p) {
          return String(p.id) != String(player.id);
        });
      },
      getCurrentRoundObject: function getCurrentRoundObject() {
        return this.rounds[this.currentRoundIndex];
      },
      reset: function reset() {
        console.log("Reseting room");
        this.players.forEach(function (player) {
          player.room = null;
          player.score = 0;
        });
        this.players = [];
        this.rounds = [];

        _game.Game.state.addRound(this.roomId, this.roundDuration);

        this.winner = null;
        this.roomState = 0;

        _game.Game.timeOuts[this.roomId].forEach(function (timeout) {
          return clearTimeout(timeout);
        });

        _game.Game.timeOuts[this.roomId] = [];
      },

      //ROOM GETTERS
      get playersCount() {
        return this.players.length;
      },

      get currentRound() {
        return this.rounds.length;
      },

      get currentRoundIndex() {
        return this.rounds.length - 1;
      },

      get hasSpace() {
        return this.playersCount < this.maxMembers;
      },

      get isLastRound() {
        return this.currentRound == this.roundsTotal;
      }

    }); //RETURN ROOM AFTER CREATING TO SUPPORT METHODS CHAINING

    return this;
  },
  addPlayer: function addPlayer(roomId, player) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var room;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              room = _this.gameRooms[roomId];

              if (!((player === null || player === void 0 ? void 0 : player.room) != null)) {
                _context.next = 4;
                break;
              }

              _context.next = 4;
              return _this.removePlayer(player);

            case 4:
              if (!(room.roomState == 0 && room.hasSpace)) {
                _context.next = 10;
                break;
              }

              room.addPlayer({
                id: player.id,
                name: player.name,
                score: 0,
                room: roomId,
                words: [],
                scores: []
              });
              player.room = roomId;
              return _context.abrupt("return", player);

            case 10:
              console.log("dupe or no space or already in another room");

            case 11:
              return _context.abrupt("return", false);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  removePlayer: function removePlayer(player) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _iterator2, _step2, room;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              player.room = null;
              _iterator2 = _createForOfIteratorHelper(_this2.gameRooms);

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  room = _step2.value;
                  room.removePlayer(player);
                  if (room.playersCount == 0) room.reset();
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  addRound: function addRound(roomId, roundDuration) {
    var room = this.gameRooms[roomId];
    var lastRound = room.rounds.length - 1;

    if (lastRound <= room.roundsTotal) {
      room.rounds.push({
        letters: "",
        startingIn: null,
        roundDuration: roundDuration,
        winner: 0,
        word: null,
        finished: false,
        startRound: function startRound() {
          var start = new Date();
          start.setSeconds(start.getSeconds() + 6);
          this.startedAt = start;
          this.startingIn = 6;
          this.letters = _game.Game.generateLetters(_game.Game.state.gameRooms[roomId].gridSize);
        }
      });
    }
  }
};
exports.State = State;