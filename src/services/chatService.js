import Chat from "../models/Chat.js";

// Create a new chat message
export const createMessage = async (messageData) => {
  const newMessage = new Chat(messageData);
  return await newMessage.save();
};

// Get all chat messages
export const getAllMessages = async () => {
  return await Chat.find().sort({ createdAt: 1 });
};

// Get chat messages between two users
export const getMessagesBetweenUsers = async (senderId, receiverId) => {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ createdAt: 1 });

    return messages;
  } catch (error) {
    throw new Error("Failed to fetch messages");
  }
};

// Delete a single chat message
export const deleteMessageById = async (messageId) => {
  try {
    return await Chat.findByIdAndDelete(messageId);
  } catch (error) {
    throw new Error("Failed to delete message");
  }
};

// Delete all messages
export const deleteAllMessages = async () => {
  try {
    return await Chat.deleteMany({});
  } catch (error) {
    throw new Error("Failed to delete all messages");
  }
};
