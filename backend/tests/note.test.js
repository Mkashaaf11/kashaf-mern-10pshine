const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/user");
const Note = require("../models/note");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { testUser, noteData } = require("./testConstants");

chai.use(chaiHttp);
const { expect } = chai;

describe("Notes Controller", () => {
  let createdTestUser;
  let authToken;
  let testNote;

  before(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    createdTestUser = await User.create({
      name: testUser.name,
      email: `test${Date.now()}@example.com`,
      password: hashedPassword,
    });

    authToken = jwt.sign({ id: createdTestUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  after(async () => {
    await Note.deleteMany({ user: createdTestUser._id });
    await User.deleteOne({ _id: createdTestUser._id });
  });

  describe("POST /api/notes", () => {
    it("should create a new note", async () => {
      const res = await chai
        .request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(noteData.validNote);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body.note).to.have.property("title", noteData.validNote.title);
      expect(res.body.note).to.have.property(
        "content",
        noteData.validNote.content
      );
      expect(res.body.note).to.have.property(
        "user",
        createdTestUser._id.toString()
      );

      testNote = res.body.note;
    });

    it("should not create a note without title", async () => {
      const res = await chai
        .request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(noteData.missingTitle);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property(
        "message",
        "Title and content are required"
      );
    });

    it("should not create a note without authentication", async () => {
      const res = await chai
        .request(app)
        .post("/api/notes")
        .send(noteData.validNote);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("message", "Not authorized, no token");
    });
  });

  describe("GET /api/notes", () => {
    it("should get all notes for the user", async () => {
      const res = await chai
        .request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.notes).to.be.an("array");
      expect(res.body.notes.length).to.be.greaterThan(0);
    });

    it("should not get notes without authentication", async () => {
      const res = await chai.request(app).get("/api/notes");

      expect(res).to.have.status(401);
      expect(res.body).to.have.property("message", "Not authorized, no token");
    });
  });

  describe("GET /api/notes/:id", () => {
    it("should get a specific note", async () => {
      const res = await chai
        .request(app)
        .get(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.note).to.have.property("_id", testNote._id);
      expect(res.body.note).to.have.property("title", testNote.title);
    });

    it("should return 404 for non-existent note", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .get(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property("message", "Note not found");
    });
  });

  describe("PUT /api/notes/:id", () => {
    it("should update a note", async () => {
      const res = await chai
        .request(app)
        .put(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(noteData.updatedNote);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.note).to.have.property(
        "title",
        noteData.updatedNote.title
      );
      expect(res.body.note).to.have.property(
        "content",
        noteData.updatedNote.content
      );
      expect(res.body.note).to.have.property("updatedAt");
    });

    it("should not update non-existent note", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        title: "Updated Test Note",
      };

      const res = await chai
        .request(app)
        .put(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property("message", "Note not found");
    });
  });

  describe("DELETE /api/notes/:id", () => {
    it("should delete a note", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body).to.have.property("message", "Note deleted");

      const deletedNote = await Note.findById(testNote._id);
      expect(deletedNote).to.be.null;
    });

    it("should return 404 when deleting non-existent note", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .delete(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property("message", "Note not found");
    });
  });
});
