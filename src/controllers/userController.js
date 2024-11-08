import {
  getUserProfile,
  findUsers,
  updateUserProfile,
} from "../services/userService.js";
import fs from 'fs/promises';
import path from "path";

// Get user by ID
export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await findUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    // Check if a new file is uploaded
    if (req.file) {
      const userProfile = await getUserProfile(userId);

      // Delete previous image if it exists and is different from the new image
      if (userProfile?.profileImage) {
        const previousImagePath = path.join(process.cwd(), userProfile.profileImage);
        try {
          await fs.unlink(previousImagePath);
        } catch (error) {
          console.error("Error deleting previous profile image:", error);
        }
      }

      // new profile image path
      profileData.profileImage = path.join("uploads", req.file.filename);
    }

    const updatedProfile = await updateUserProfile(userId, profileData);
    if (!updatedProfile) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};
