const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const db = require("../config/db");
const app = require("../server");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  testUser,
  wrongUser,
  newPassword,
  resetToken,
} = require("./testConstants");

chai.use(chaiHttp);
const { expect } = chai;

describe("User Controller", () => {
  let createdTestUser;
  let authToken;

  before(async () => {
    await db();
  });

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    createdTestUser = await User.create({
      name: testUser.name,
      email: `test${Date.now()}@example.com`,
      password: hashedPassword,
    });

    authToken = jwt.sign({ id: createdTestUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Test user created:", createdTestUser._id);
    console.log("Generated Token:", authToken);
  });

  afterEach(async () => {
    await User.deleteOne({ _id: createdTestUser._id });
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
        .get(`/api/user/${createdTestUser._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name", "Test user");
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
        .put(`/api/user/${createdTestUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test user",
        });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "User updated successfully");
      expect(res.body.user).to.have.property("name", "Test user");
    });

    it("should not update password without correct old password", async () => {
      const res = await chai
        .request(app)
        .put(`/api/user/${createdTestUser._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          currentPassword: wrongUser.password,
          newPassword: newPassword,
        });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message", "Incorrect old password");
    });
  });

  describe("DELETE /api/user/:id", () => {
    it("should delete a user", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/user/${createdTestUser._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "User deleted successfully");

      const deletedUser = await User.findById(createdTestUser._id);
      expect(deletedUser).to.be.null;
    });
  });
});
