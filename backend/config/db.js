const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

const dbName = process.env.DB_NAME || "kashaf_mern_10pshine";
const mongoUriWithDb = `${process.env.MONGO_URI}${dbName}`;

const db = async () => {
  try {
    await mongoose.connect(mongoUriWithDb);
    logger.info(`Connected to MongoDB: ${dbName}`);
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = db;
