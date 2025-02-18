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

let createdTestUser;

before(async () => {
  await db();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
  await new Promise((resolve) => setTimeout(resolve, 500));
  createdTestUser = await User.create({
    name: testUser.name,
    email: testUser.email,
    password: testUser.password,
  });
});

describe("Auth Controller", () => {
  it("should create a new user successfully", async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const res = await chai
      .request(app)
      .post("/api/auth/signup")
      .send({ ...testUser, email: uniqueEmail });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("message", "User created successfully");
  });

  it("should not allow duplicate email registration", async () => {
    const res = await chai.request(app).post("/api/auth/signup").send(testUser);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Email already in use");
  });

  it("should login successfully with correct credentials", async () => {
    await chai.request(app).post("/api/auth/signup").send(testUser);

    const res = await chai.request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Login successful");
    expect(res.body).to.have.property("token");
  });

  it("should not login with incorrect credentials", async () => {
    const res = await chai.request(app).post("/api/auth/login").send(wrongUser);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Invalid email or password");
  });

  it("should send a password reset email if user exists", async () => {
    const res = await chai.request(app).post("/api/auth/forgot-password").send({
      email: testUser.email,
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Reset token sent to email");
  });

  it("should not send password reset email for non-existing user", async () => {
    const res = await chai.request(app).post("/api/auth/forgot-password").send({
      email: "nonexistent@example.com",
    });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("message", "User not found");
  });

  it("should reset the password successfully with a valid token", async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    const user = await User.create({
      name: testUser.name,
      email: uniqueEmail,
      password: testUser.password,
      resetToken: "validResetToken",
      resetTokenExpiry: Date.now() + 3600000,
    });
    const res = await chai
      .request(app)
      .post("/api/auth/reset-password/validResetToken")
      .send({
        newPassword,
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("message", "Password reset successful");
  });

  it("should not reset password with an invalid or expired token", async () => {
    const res = await chai
      .request(app)
      .post("/api/auth/reset-password/invalid-token")
      .send({
        newPassword,
      });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Invalid or expired token");
  });
});
