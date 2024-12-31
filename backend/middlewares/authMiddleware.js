const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.error("No Token. Not Authorized!");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.error("Token expired");
      return res.status(401).json({ message: "Token expired" });
    }
    logger.error("Invalid Token. Not Authorized!");
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };
