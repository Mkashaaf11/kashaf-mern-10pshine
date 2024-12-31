const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  logger.info(
    {
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
    "Incoming Request"
  );

  next();
};

module.exports = requestLogger;
