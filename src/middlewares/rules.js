import { config } from "../config/config";
import { logger } from "../logger/logging";

const NAMESPACE = "CORS";

// API RULES | OPTIONS | CORS etc...
export const rulesMiddleware = (req, res, next) => {
  if (req.url != "/api/state") {
    res.header("Access-Control-Allow-Origin", config.server.hostname);
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Credentials, Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");

    logger.info(NAMESPACE, `[REQ-HEADERS] User-Agent: ${req.get("User-Agent")}`);
    logger.info(NAMESPACE, `[REQ-HEADERS] Access-Control-Allow-Origin: ${res.get("Access-Control-Allow-Origin")}`);
    logger.info(NAMESPACE, `[REQ-HEADERS] Access-Control-Allow-Headers: ${res.get("Access-Control-Allow-Headers")}`);
    logger.info(
      NAMESPACE,
      `[REQ-HEADERS] Access-Control-Allow-Credentials: ${res.get("Access-Control-Allow-Credentials")}`
    );

    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      logger.info(NAMESPACE, `[RES-HEADERS] Access-Control-Allow-Methods: ${res.get("Access-Control-Allow-Methods")}`);
      return res.status(200).send();
    }
    res.on("finish", () => {
      const msg = [res.get("Content-Type"), req.url, req.socket.remoteAddress, res.statusCode];
      logger.info(NAMESPACE, `[RES-HEADERS] Content-Type: ${msg[0]}`);
      logger.info(NAMESPACE, `[RES-HEADERS] URL: ${msg[1]}`);
      logger.info(NAMESPACE, `[RES-HEADERS] IP: ${msg[2]}`);
      logger.info(NAMESPACE, `[RES-HEADERS] STATUS: ${msg[3]}`);
    });
  }
  next();
};
