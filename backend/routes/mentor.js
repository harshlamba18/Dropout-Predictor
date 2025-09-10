import express from "express";
import { getAllMentors, getMentorById } from "../controllers/mentorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Student from "../models/Student.js";

const router = express.Router();

// GET all mentors (for Admin Dashboard)
router.get("/", authMiddleware, getAllMentors);

// GET a single mentor's profile details
router.get("/:mentorId", authMiddleware, getMentorById);

// GET all students for a specific mentor
router.get("/:mentorId/students", authMiddleware, async (req, res) => {
  try {
    const { mentorId } = req.params;
    const students = await Student.find({ mentorId }).select("-password -__v");
    
    if (!students) {
        return res.status(404).json({ message: "No students found for this mentor." });
    }

    res.json(students);
  } catch (err) {
    console.error("Error fetching students for mentor:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

