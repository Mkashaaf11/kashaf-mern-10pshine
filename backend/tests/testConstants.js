module.exports = {
  testUser: {
    name: "Test user",
    email: "test@example.com",
    password: "123456",
  },
  wrongUser: {
    email: "wrong@example.com",
    password: "wrongpassword",
  },

  newPassword: "newpassword",
  resetToken: "valid-token",
  noteData: {
    validNote: {
      title: "Test Note",
      content: "This is a test note content",
    },
    missingTitle: {
      content: "This is a test note content",
    },
    updatedNote: {
      title: "Updated Test Note",
      content: "This is updated content",
    },
  },
};
