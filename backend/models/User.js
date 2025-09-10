import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Optional username (used for admin login if needed)
  username: { type: String },

  // Mentor-specific ID
  mentorId: { type: String, unique: true, sparse: true }, // unique only for mentors

  // Student-specific ID
  studentId: { type: String, unique: true, sparse: true }, // unique only for students

  // Password (hashed for DB users)
  password: { type: String, required: true },

  // Role: admin / mentor / student
  role: { 
    type: String, 
    enum: ["admin", "mentor", "student"], 
    required: true 
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
