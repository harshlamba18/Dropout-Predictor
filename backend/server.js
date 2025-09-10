import dotenv from "dotenv";
dotenv.config(); // 🔹 must come first
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import adminRoutes from "./routes/admin.js";
import mentorRoutes from "./routes/mentor.js";
import chatRoutes from "./routes/chat.js"; // ✅ Import chat routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/chat", chatRoutes); // ✅ Register chat routes

// Root
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
