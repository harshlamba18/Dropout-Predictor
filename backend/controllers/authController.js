import dotenv from "dotenv";
dotenv.config(); // must be first
import Mentor from "../models/Mentor.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

// 🔹 Login (admin / mentor / student)
export const login = async (req, res) => {
  try {
    const { username, mentorId, studentId, password, role } = req.body;

    // --- Admin login (hardcoded credentials, but now with a REAL token)
    if (role === "admin") {
      if (username === "Harsh" && password === "123456") {
        
        // ✅ FIX: Generate a real JWT for the admin
        const token = jwt.sign(
          { id: "admin_user_01", role: "admin" }, // A simple payload for the admin
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.json({
          token: token, // Send the real token
          role: "admin",
          message: "Admin logged in successfully",
        });
      } else {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }
    }

    // --- Mentor login
    if (role === "mentor") {
      const mentor = await Mentor.findOne({ mentorId });
      if (!mentor) return res.status(400).json({ message: "Mentor not found" });

      const isMatch = await bcrypt.compare(password, mentor.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: mentor._id, mentorId: mentor.mentorId, role: "mentor" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ token, role: "mentor", message: "Login successful" });
    }

    // --- Student login
    if (role === "student") {
      const student = await Student.findOne({ studentId });
      if (!student)
        return res.status(400).json({ message: "Student not found" });

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: student._id,
          studentId: student.studentId,
          role: "student",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ token, role: "student", message: "Login successful" });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Admin adds mentor
export const addMentor = async (req, res) => {
  try {
    const { mentorId, password } = req.body;
    if (!mentorId || !password)
      return res.status(400).json({ message: "All fields required" });

    // 1. Load master JSON
    const filePath = path.join(process.cwd(), "data", "mentors.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // 2. Check mentor exists in JSON
    const masterMentor = data.find((m) => m.id === mentorId);
    if (!masterMentor)
      return res.status(400).json({ message: "Mentor ID not found in master list" });
    
    // 3. Check if already in DB
    const existing = await Mentor.findOne({ mentorId });
    if (existing)
      return res.status(400).json({ message: "Mentor ID already exists" });

    // 4. Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // 5. Save mentor with full JSON data
    const mentor = new Mentor({
      mentorId,
      password: hashed,
      name: masterMentor.name,
      email: masterMentor.email,
      department: masterMentor.department,
      year: masterMentor.year,
      skills: masterMentor.skills,
    });

    await mentor.save();
    res.json({ message: "Mentor added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Mentor adds student
export const addStudent = async (req, res) => {
  try {
    const { studentId, password, mentorId } = req.body;

    if (!studentId || !password || !mentorId)
      return res.status(400).json({ message: "All fields required" });

    // ✅ NEW: Find the mentor who is adding the student in the database
    const currentMentor = await Mentor.findOne({ mentorId });
    if (!currentMentor) {
        return res.status(404).json({ message: "Assigning mentor not found in the database." });
    }

    const filePath = path.join(process.cwd(), "data", "students.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const masterStudent = data.find((s) => s.student_id === studentId);
    if (!masterStudent)
      return res
        .status(400)
        .json({ message: "Student ID not found in master list" });

    const existing = await Student.findOne({ studentId });
    if (existing)
      return res.status(400).json({ message: "Student already added" });

    const hashed = await bcrypt.hash(password, 10);

    const student = new Student({
      // Keep student details from the JSON file
      ...masterStudent,
      studentId, // Ensure these are set from the request
      password: hashed,
      mentorId,

      // ✅ FIXED: Overwrite mentor details with the current mentor's data from the DB
      mentor_name: currentMentor.name,
      mentor_email: currentMentor.email,
    });

    await student.save();
    res.json({ message: "Student added successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

