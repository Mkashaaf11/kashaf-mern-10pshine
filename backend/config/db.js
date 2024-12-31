const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");

dotenv.config();

const db = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      dbName: "kashaf_mern_10pshine",
    });
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${err}`);
  }
};

module.exports = db;
