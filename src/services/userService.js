import User from "../models/User.js";

export const getUserProfile = async (userId) => {
  try {
    return await User.findById(userId).select("-password");
  } catch (error) {
    throw new Error("Failed to fetch user profile.");
  }
};

export const findUsers = async () => {
  try {
    return await User.find().select("-password");
  } catch (error) {
    throw new Error("Failed to fetch users data.");
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    return await User.findByIdAndUpdate(userId, profileData, { new: true });
  } catch (error) {
    throw new Error("Failed to update user profile.");
  }
};
