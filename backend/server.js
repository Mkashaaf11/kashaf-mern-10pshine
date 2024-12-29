const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const logger = require("./utils/logger");
const requestLogger = require("./middlewares/requestLogger");

const app = express();
app.use(express.json());
app.use(requestLogger);
connectDB();

app.get("/", (req, res) => {
  logger.info("GET request to Home Route ");
  res.send("Welcome to the Node.js API with MongoDB Atlas");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
