import Chat from "../models/Chat.js";
import {
  createMessage,
  deleteAllMessages,
  deleteMessageById,
  getAllMessages,
  getMessagesBetweenUsers,
} from "../services/chatService.js";

// Handle creating a new chat message
export const createChatMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message) {
      return res
        .status(400)
        .json({ message: "Sender, receiver, and message are required" });
    }

    const newMessage = await createMessage({ sender, receiver, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle get all chat messages
export const getAllChatMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle get chat message
export const findChat = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "name");
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Handle get chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await getMessagesBetweenUsers(senderId, receiverId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle Delete a single message
export const deleteChatMessage = async (req, res) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await deleteMessageById(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle Delete all messages
export const deleteAllChatMessages = async (req, res) => {
  try {
    await deleteAllMessages();
    res.status(200).json({ message: "All messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
