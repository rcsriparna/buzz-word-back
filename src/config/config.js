const DEBUG = true;
const GRID_SIZE = process.env.GRID_SIZE;

const SERVER_PORT = process.env.PORT;
const SERVER_HOSTNAME = process.env.HOSTNAME;
const SERVER_API_BASE = "/api";
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  retryWrites: true,
  useCreateIndex: true,
};

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_DB = process.env.MONGO_DB;
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
  gridSize: GRID_SIZE,
};
