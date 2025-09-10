import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mentorId: { type: String, required: true }, // link to mentor
  // Full student info from master JSON
  name: String,
  gender: String,
  dob: String,
  program: String,
  year: Number,
  attendance_pct: Number,
  days_absent_est: Number,
  attempts_math: Number,
  attempts_physics: Number,
  attempts_chemistry: Number,
  attempts_english: Number,
  attempts_total_gt1: Number,
  weekly_scores: [Number],
  avg_score: Number,
  last_test_score: Number,
  fee_status: String,
  fee_due_amount: Number,
  last_payment_date: String,
  mentor_name: String,
  mentor_email: String,
  guardian_contact: String,
  risk_points: Number,
  risk_level: String
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
