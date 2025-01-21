const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const db = require("../config/db");
const app = require("../server");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
const { expect } = chai;

describe("User Controller", () => {
  let testUser;
  let authToken;

  before(async () => {
    await db();
  });

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: hashedPassword,
    });

    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Test user created:", testUser._id);
    console.log("Generated Token:", authToken);
  });

  afterEach(async () => {
    await User.deleteOne({ _id: testUser._id });
  });

  after(async () => {
    if (process.env.SINGLE_TEST) {
      await mongoose.disconnect();
    }
  });

  describe("GET /api/user", () => {
    it("should get all users", async () => {
      const res = await chai
        .request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 401 without auth token", async () => {
      const res = await chai.request(app).get("/api/user");
      expect(res).to.have.status(401);
      expect(res.body).to.have.property("message", "Not authorized, no token");
    });
  });

  describe("GET /api/user/:id", () => {
    it("should get a user by ID", async () => {
      const res = await chai
        .request(app)
        .get(`/api/user/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name", "Test User");
    });

    it("should return 404 if user is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai
        .request(app)
        .get(`/api/user/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property("message", "User not found");
    });
  });

  describe("PUT /api/user/:id", () => {
    it("should update a user", async () => {
      const res = await chai
        .request(app)
        .put(`/api/user/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Updated Name",
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "User updated successfully");
      expect(res.body.user).to.have.property("name", "Updated Name");
    });

    it("should not update password without correct old password", async () => {
      const res = await chai
        .request(app)
        .put(`/api/user/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          oldPassword: "wrongpassword",
          newPassword: "newpassword123",
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message", "Incorrect old password");
    });
  });

  describe("DELETE /api/user/:id", () => {
    it("should delete a user", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/user/${testUser._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "User deleted successfully");

      // Verify user is deleted
      const deletedUser = await User.findById(testUser._id);
      expect(deletedUser).to.be.null;
    });
  });
});
