import express from "express";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "supersecret"; // same as used in authController

// 🔹 Get student info (protected route)
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId }).select("-password -__v");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
