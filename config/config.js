import { config as dotenv } from "dotenv";
import path from "path";
dotenv({ path: path.resolve(__dirname, "../.env") });

const DEBUG = true;
const FRONT_END_FOLDER = process.env.FRONT_END_FOLDER || "BuzzWords-Front-End";
const FRONT_END_STATIC = process.env.FRONT_END_STATIC || "assets";
const GRID_SIZE = process.env.GRID_SIZE || 127;

const FRONT_END = { static: FRONT_END_STATIC, root: FRONT_END_FOLDER };

const SERVER_PORT = 3000;
const SERVER_HOSTNAME = "http://localhost";
const SERVER_API_BASE = "/api";
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  retryWrites: true,
  useCreateIndex: true,
};

// const MONGO_USERNAME = "";
// const MONGO_PASSWORD = "";
// const MONGO_HOST = "localhost";
// const MONGO_DB = "buzz-words";
// const MONGO_SECRET = "J<ctr5J%S8,5jf+%RSFgwBfK=j=PvonCcV~KxoQO9x/Xkrxg=6z2MowEl3ml:W4";
const MONGO_USERNAME = "adamr_space_admin";
const MONGO_PASSWORD = "ytrZ7TqjjzAEY5t";
const MONGO_HOST = "cluster0.voszz.mongodb.net";
const MONGO_DB = "buzz-words";
const MONGO_SECRET = "J<ctr5J%S8,5jf+%RSFgwBfK=j=PvonCcV~KxoQO9x/Xkrxg=6z2MowEl3ml:W4";

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  options: MONGO_OPTIONS,
  db: MONGO_DB,
  secret: MONGO_SECRET,
  // url: `mongodb://${MONGO_HOST}/${MONGO_DB}`,
  url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}`,
};

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
  api_base: SERVER_API_BASE,
};

const HTTP_RES_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
};

export const config = {
  debug: DEBUG,
  server: SERVER,
  mongo: MONGO,
  http: HTTP_RES_CODES,
  front: FRONT_END,
  gridSize: GRID_SIZE,
};
