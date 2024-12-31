const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

noteSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isModified("content")) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model("Note", noteSchema);
