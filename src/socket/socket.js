import { Server } from "socket.io";
import http from "http";
import express from "express";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

const getOnlineUsers = async () => {
  const users = await User.find().select(
    "_id name email isOnline lastLoginTime"
  );

  return users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    lastLoginTime: user.lastLoginTime,
  }));
};

// On client connection
io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  if (userId) {
    userSocketMap[userId] = socket.id;
    User.findByIdAndUpdate(userId, { isOnline: true }).exec();

    // Send only online users to all connected clients
    getOnlineUsers().then((users) => {
      io.emit("getOnlineUsers", users);
    });

    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // Listen for message events
  socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;
    try {
      const senderUser = await User.findById(sender);
      const chat = new Chat({ sender, receiver, message });
      await chat.save();

      const receiverSocketId = userSocketMap[receiver];

      const messageData = {
        ...chat.toObject(),
        senderName: senderUser.name,
        createdAt: chat.createdAt,
      };

      // Emit the message to the receiver and the sender
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", messageData);
      }
      socket.emit("receiveMessage", messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Emit userOnline status when a user connects
  socket.on("userOnline", (userId) => {
    Object.keys(userSocketMap).forEach((id) => {
      io.to(userSocketMap[id]).emit("userOnline", userId);
    });
  });

  // On client disconnect
  socket.on("disconnect", async () => {
    const userId = Object.keys(userSocketMap).find(
      (id) => userSocketMap[id] === socket.id
    );

    if (userId) {
      delete userSocketMap[userId];
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastLoginTime: new Date(),
      });

      // Emit updated list of only online users
      const users = await getOnlineUsers();
      io.emit("getOnlineUsers", users);
    }

    console.log("Client disconnected:", socket.id);
  });
});

export { app, io, server };
