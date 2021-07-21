"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _dotenv = require("dotenv");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _dotenv.config)({
  path: _path.default.resolve(__dirname, "../.env")
});
var DEBUG = true;
var FRONT_END_FOLDER = process.env.FRONT_END_FOLDER || "../BuzzWords-Front-End";
var FRONT_END_STATIC = process.env.FRONT_END_STATIC || "assets";
var GRID_SIZE = process.env.GRID_SIZE || 127;
var FRONT_END = {
  static: FRONT_END_STATIC,
  root: FRONT_END_FOLDER
};
var SERVER_PORT = process.env.PORT || 3000;
var SERVER_HOSTNAME = "https://buzz-words-back.herokuapp.com";
var SERVER_API_BASE = "/api";
var MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  retryWrites: true,
  useCreateIndex: true
}; // const MONGO_USERNAME = "";
// const MONGO_PASSWORD = "";
// const MONGO_HOST = "localhost";
// const MONGO_DB = "buzz-words";
// const MONGO_SECRET = "J<ctr5J%S8,5jf+%RSFgwBfK=j=PvonCcV~KxoQO9x/Xkrxg=6z2MowEl3ml:W4";

var MONGO_USERNAME = "adamr_space_admin";
var MONGO_PASSWORD = "ytrZ7TqjjzAEY5t";
var MONGO_HOST = "cluster0.voszz.mongodb.net";
var MONGO_DB = "buzz-words";
var MONGO_SECRET = "J<ctr5J%S8,5jf+%RSFgwBfK=j=PvonCcV~KxoQO9x/Xkrxg=6z2MowEl3ml:W4";
var MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  db: MONGO_DB,
  secret: MONGO_SECRET,
  // url: `mongodb://${MONGO_HOST}/${MONGO_DB}`,
  url: "mongodb+srv://".concat(MONGO_USERNAME, ":").concat(MONGO_PASSWORD, "@").concat(MONGO_HOST, "/").concat(MONGO_DB)
};
var SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  api_base: SERVER_API_BASE
};
var HTTP_RES_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401
};
var config = {
  debug: DEBUG,
  server: SERVER,
  mongo: MONGO,
  http: HTTP_RES_CODES,
  front: FRONT_END,
  gridSize: GRID_SIZE
};
exports.config = config;