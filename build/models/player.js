"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerModel = void 0;

var _mongoose = require("mongoose");

var _passportLocalMongoose = _interopRequireDefault(require("passport-local-mongoose"));

var _passport = _interopRequireDefault(require("passport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Model schema for player
var playerSchema = new _mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  password: String,
  score: Number
});
playerSchema.plugin(_passportLocalMongoose.default);
var PlayerModel = (0, _mongoose.model)("Player", playerSchema);
exports.PlayerModel = PlayerModel;

_passport.default.use(PlayerModel.createStrategy());

_passport.default.serializeUser(PlayerModel.serializeUser());

_passport.default.deserializeUser(PlayerModel.deserializeUser());