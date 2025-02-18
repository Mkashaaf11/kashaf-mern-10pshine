const logger = require("../utils/logger");
const Note = require("../models/note");

exports.getNotes = async (req, res) => {
  try {
    logger.info(`Fetching all notes for user ${req.user.id}`);
    const notes = await Note.find({ user: req.user.id });
    logger.info(
      `Successfully fetched ${notes.length} notes for user ${req.user.id}`
    );
    res.status(200).json({ success: true, notes });
  } catch (error) {
    logger.error(
      `Error fetching notes for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
};

exports.getNote = async (req, res) => {
  try {
    logger.info(
      `Fetching note with ID ${req.params.id} for user ${req.user.id}`
    );
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      logger.warn(
        `Note with ID ${req.params.id} not found for user ${req.user.id}`
      );
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    logger.info(
      `Successfully fetched note with ID ${req.params.id} for user ${req.user.id}`
    );
    res.status(200).json({ success: true, note });
  } catch (error) {
    logger.error(
      `Error fetching note with ID ${req.params.id} for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ success: false, message: "Error fetching note" });
  }
};

exports.addNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    logger.warn("Add note failed due to missing title or content");
    return res
      .status(400)
      .json({ success: false, message: "Title and content are required" });
  }

  try {
    logger.info(`Adding a new note for user ${req.user.id}`);
    const newNote = await Note.create({
      user: req.user.id,
      title,
      content,
      createdAt: new Date(),
    });
    logger.info(
      `Successfully added note with ID ${newNote._id} for user ${req.user.id}`
    );
    res.status(201).json({ success: true, note: newNote });
  } catch (error) {
    logger.error(`Error adding note for user ${req.user.id}: ${error.message}`);
    res.status(500).json({ success: false, message: "Error adding note" });
  }
};

exports.editNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    logger.info(
      `Editing note with ID ${req.params.id} for user ${req.user.id}`
    );
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      logger.warn(
        `Note with ID ${req.params.id} not found for user ${req.user.id}`
      );
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();
    logger.info(
      `Successfully updated note with ID ${req.params.id} for user ${req.user.id}`
    );
    res.status(200).json({ success: true, note });
  } catch (error) {
    logger.error(
      `Error editing note with ID ${req.params.id} for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ success: false, message: "Error editing note" });
  }
};

exports.removeNote = async (req, res) => {
  try {
    logger.info(
      `Deleting note with ID ${req.params.id} for user ${req.user.id}`
    );
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!note) {
      logger.warn(
        `Note with ID ${req.params.id} not found for user ${req.user.id}`
      );
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    logger.info(
      `Successfully deleted note with ID ${req.params.id} for user ${req.user.id}`
    );
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    logger.error(
      `Error deleting note with ID ${req.params.id} for user ${req.user.id}: ${error.message}`
    );
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
};
