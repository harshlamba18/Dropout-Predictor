import express from "express";
import {
  authMiddleware,
  getHistory,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/history", authMiddleware, getHistory);
router.post("/", authMiddleware, sendMessage);

export default router;
