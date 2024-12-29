const express = require("express");
const router = express.Router();
const { getNotes } = require("../controllers/notesController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getNotes);

module.exports = router;
