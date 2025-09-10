import express from "express";
import { login, addMentor, addStudent } from "../controllers/authController.js";

const router = express.Router();

// Login for all roles
router.post("/login", login);

// Admin adds mentor
router.post("/admin/add-mentor", addMentor);

// Mentor adds student
router.post("/mentor/add-student", addStudent);

export default router;
