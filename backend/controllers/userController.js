const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    logger.info("Fetching all users");
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Fetching user with ID: ${id}`);
    const user = await User.findById(id).select("-password");
    if (!user) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user with ID ${id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = user.name;
    user.email = user.email;

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      user.password = newPassword;
    }

    const updatedUser = await user.save();
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`Deleting user with ID: ${id}`);

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User successfully deleted with ID: ${id}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user with ID ${id}: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
