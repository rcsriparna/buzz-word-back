import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { logger } from "./logger/logging";
import { config } from "./config/config";
import session from "express-session";
import MongoStore from "connect-mongo";
import { GameState } from "./game/game";
import { apiRouter } from "./routes/api";
import { authRouter } from "./routes/auth";
import { requestMiddleware } from "./middlewares/logging";
import { rulesMiddleware } from "./middlewares/rules";
import { errorMiddleware } from "./middlewares/errors";

//NAMESPACE FOR logger
const NAMESPACE = "APP";

//create express server
//Express.js, or simply Express, is a back end web application framework for Node.js
//It is designed for building web applications and APIs. It has been called the de facto standard server
const app = express(); //create instance of server

//ALL MIDDLEWARES - START
//configure session
//express-session is a middleware for express handling session setting and reading
const exp_sessions = session({
  secret: config.mongo.secret,
  name: "buzz-words-session",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: config.mongo.url }),
});

//SESSIONS
app.use(exp_sessions);
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
//JSON body parsing
app.use(express.json());
//REQUESTS / RESPONSES
app.use(requestMiddleware);
//CORS / RULES
app.use(rulesMiddleware);
//ROUTES
app.use(config.server.api_base, apiRouter);
app.use("/", authRouter);
//ERRORS
app.use(errorMiddleware);
//ALL MIDDLEWARES - END

//runs express server and connects to database
const connect = async () => {
  try {
    //await connection to DB
    await mongoose.connect(config.mongo.url, config.mongo.options);
    logger.info(NAMESPACE, `Connected to mongoDB host: ${config.mongo.url}`);
  } catch (err) {
    //ERROR log
    logger.error(NAMESPACE, "ERROR:", err);
  } finally {
    //finally all good and ready to start listening on server
    srv = app.listen(config.server.port, serverUp);
  }
};

//runs when server is up
const serverUp = () => {
  logger.info(NAMESPACE, `Server is running on: ${config.server.hostname}:${srv.address().port}`);
  logger.info(NAMESPACE, `Server API: ${config.server.hostname}:${srv.address().port}${config.server.api_base}`);
  logger.info(NAMESPACE, `API Endpoint: "/join" METHOD: POST, Accepts: JSON => JSON`);
  logger.info(NAMESPACE, `API Endpoint: "/dict" METHOD: POST, Accepts: JSON => JSON`);
  logger.info(NAMESPACE, `API Endpoint: "/rndletters/:size" METHOD: GET, Accepts: query[number] => JSON`);
  logger.info(NAMESPACE, `Server AUTH: ${config.server.hostname}:${srv.address().port}/`);
  logger.info(NAMESPACE, `AUTH Endpoint: "/login" METHOD: POST, Accepts: JSON => JSON`);
  logger.info(NAMESPACE, `AUTH Endpoint: "/logout" METHOD: GET, Accepts: null => null`);
};

//entry point - initiates application
//We create global srv variable to be able to get back server object and read port
//If we supply port 0 in config - port would be assinged randomly (some hostings might require that) and it will get properly printed in console
let srv;
connect();

//instantiate GameState
export const game = new GameState();








