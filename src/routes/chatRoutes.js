import express from "express";
import {
  createChatMessage,
  findChat,
  getAllChatMessages,
  getChatHistory,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", createChatMessage);
router.get("/get", getAllChatMessages);
router.get("/:id", findChat);
router.get("/:senderId/:receiverId", getChatHistory);

export default router;
