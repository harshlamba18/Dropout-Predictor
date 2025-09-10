import express from "express";
import Mentor from "../models/Mentor.js";

const router = express.Router();

// Get all mentors
router.get("/mentors", async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password -__v");
    res.json(mentors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
