const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger");

// Register new user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    logger.info("Attempting to register a new user");
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn(`Signup failed: Email "${email}" is already in use`);
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.create({ name, email, password });
    logger.info(
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      "New user successfully created"
    );

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    logger.error(`Error during user registration: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    logger.info(`Attempting login for email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(
        `Login failed: Invalid email or password for email "${email}"`
      );
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Password mismatch for email "${email}"`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info(`User "${email}" successfully logged in`);
    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: { email: user.email, name: user.name },
      });
  } catch (error) {
    logger.error(`Error during login for email "${email}": ${error.message}`);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    logger.info(`Password reset requested for email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Password reset failed: User not found for email "${email}"`);
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${FRONTEND_URL}/auth/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Password Reset",
      `Reset your password here: ${resetUrl}`
    );
    logger.info(`Password reset email sent to "${email}"`);
    res.status(200).json({ message: "Reset token sent to email" });
  } catch (error) {
    logger.error(
      `Error sending password reset email to "${email}": ${error.message}`
    );
    res.status(500).json({
      message: "Error sending password reset link",
      error: error.message,
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    logger.info(`Attempting password reset with token "${token}"`);
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      logger.warn(`Password reset failed: Invalid or expired token "${token}"`);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    logger.info(`Password successfully reset for user "${user.email}"`);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error(
      `Error resetting password with token "${token}": ${error.message}`
    );
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};
