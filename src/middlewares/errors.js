import { logger } from "../logger/logging";

const NAMESPACE = "MIDDLEWARE Errors";

// ERROR HANDLING
export const errorMiddleware = (err, req, res, next) => {
  logger.error(NAMESPACE, "ERROR:", err);
  res.status(500).json({ message: err.message });
};
