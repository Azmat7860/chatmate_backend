import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import {
  deleteAllChatMessages,
  deleteChatMessage,
} from "../controllers/chatController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/:userId", getUser);
router.get("/", getUsers);
router.put("/:userId", upload.single("profileImage"), updateUser);
router.delete("/delete/:msgId", deleteChatMessage);
router.delete("/deleteAll", deleteAllChatMessages);

export default router;
