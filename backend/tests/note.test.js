const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/user");
const Note = require("../models/note");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const { expect } = chai;

describe("Notes Controller", () => {
  let testUser;
  let authToken;
  let testNote;

  // Run once before all tests
  before(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: hashedPassword,
    });

    // Generate authentication token
    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  // Clean up after all tests
  after(async () => {
    await Note.deleteMany({ user: testUser._id });
    await User.deleteOne({ _id: testUser._id });
  });

  describe("POST /api/notes", () => {
    it("should create a new note", async () => {
      const noteData = {
        title: "Test Note",
        content: "This is a test note content",
      };

      const res = await chai
        .request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(noteData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("success", true);
      expect(res.body.note).to.have.property("title", noteData.title);
      expect(res.body.note).to.have.property("content", noteData.content);
      expect(res.body.note).to.have.property("user", testUser._id.toString());

      testNote = res.body.note; // Save for later tests
    });

    it("should not create a note without title", async () => {
      const noteData = {
        content: "This is a test note content",
      };

      const res = await chai
        .request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${authToken}`)
        .send(noteData);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property(
        "message",
        "Title and content are required"
      );
    });

    it("should not create a note without authentication", async () => {
      const noteData = {
        title: "Test Note",
        content: "This is a test note content",
      };

      const res = await chai.request(app).post("/api/notes").send(noteData);

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
      const updateData = {
        title: "Updated Test Note",
        content: "This is updated content",
      };

      const res = await chai
        .request(app)
        .put(`/api/notes/${testNote._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.note).to.have.property("title", updateData.title);
      expect(res.body.note).to.have.property("content", updateData.content);
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

      // Verify note is deleted
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
