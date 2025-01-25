import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../services/context/authContext";
import { getUser, updateUser } from "../services/userService";
import { User as LuUser } from "lucide-react";

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  const { user, logout, loading } = auth;
  const [profileData, setProfileData] = useState(null);
  const [editName, setEditName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) {
          return;
        }
        const userData = await getUser(user._id);
        setProfileData(userData);
        setEditName(userData.name);
      } catch (err) {
        setError("Failed to load profile data");
      }
    };

    if (!loading) {
      fetchProfileData();
    }
  }, [user, loading]);

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    setError(null);
    setSuccess(null);
  };

  const handleSaveChanges = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!user) {
        setError("User not found");
        return;
      }

      const updates = {};
      if (editName !== profileData.name) {
        updates.name = editName;
      }

      if (currentPassword && newPassword) {
        if (newPassword.length < 6) {
          setError("New password must be at least 6 characters.");
          return;
        }
        updates.currentPassword = currentPassword;
        updates.newPassword = newPassword;
      }

      if (Object.keys(updates).length === 0) {
        setError("No changes to save.");
        return;
      }

      const updatedUser = await updateUser(user._id, updates);
      setProfileData(updatedUser);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please check your inputs."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#d5e3a6]">
        <p className="text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#d5e3a6]">
        <p className="text-red-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#d5e3a6]">
        <p className="text-red-500">
          {error || "Unable to load profile. Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#2ab6ac] p-6 text-white text-center">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center">
            <LuUser size={64} className="text-[#2ab6ac]" />
          </div>
          {editMode ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter your name"
              className="mt-4 border border-white bg-transparent rounded-lg p-2 w-64 text-white placeholder-white/70 text-center focus:outline-none focus:ring-2 focus:ring-white"
            />
          ) : (
            <h2 className="mt-4 text-2xl font-bold">{profileData.name}</h2>
          )}
          <p className="text-white/90 mt-2">{profileData.email}</p>
        </div>

        <div className="p-8">
          {editMode && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Edit Profile
              </h3>
              <div>
                <label className="block text-gray-700 mb-2">
                  Current Password:
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ab6ac]"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  New Password:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ab6ac]"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {editMode ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-3 bg-[#2ab6ac] text-white rounded-lg hover:bg-[#249d94] transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-6 py-3 bg-[#2ab6ac] text-white rounded-lg hover:bg-[#249d94] transition-colors duration-200"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
