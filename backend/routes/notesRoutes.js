const express = require("express");
const router = express.Router();
const {
  getNotes,
  getNote,
  addNote,
  editNote,
  removeNote,
} = require("../controllers/notesController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getNotes);
router.get("/:id", protect, getNote);
router.post("/", protect, addNote);
router.put("/:id", protect, editNote);
router.delete("/:id", protect, removeNote);

module.exports = router;
