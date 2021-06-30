import { logger } from "../logger/logging";

const NAMESPACE = "HTTP";

//REQUEST LOGGING SESSION/REQUEST
export const requestMiddleware = (req, res, next) => {
  if (req.url != "/api/state" && req.url != "/timesync") {
    logger.info(NAMESPACE, `METHOD - [${req.method}]`);
    logger.info(NAMESPACE, `URL - [${req.url}]`);
    logger.info(NAMESPACE, `IP - [${req.socket.remoteAddress}]`);
    logger.info(NAMESPACE, `SESSION-ID - [${req.session.id}]`);
    logger.info(NAMESPACE, `COOKIE:`, req.session.cookie);
  }
  next();
};
