import dotenv from "dotenv";
dotenv.config();
import Chat from "../models/Chat.js";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

// 🔹 Auth middleware
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // DEBUG: Log the decoded token to see its contents
    console.log("Decoded JWT payload:", decoded);
    req.user = decoded; // { id, studentId, role } OR { id, mentorId, role }
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

// 🔹 Get chat history
export const getHistory = async (req, res) => {
  try {
    const studentDbId = req.user.id; // ✅ Correctly use the database ID from token
    if (!studentDbId)
      return res.status(403).json({ error: "Access denied. No user ID in token." });

    let chat = await Chat.findOne({ userId: studentDbId });
    if (!chat) chat = await Chat.create({ userId: studentDbId, messages: [] });

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// 🔹 Send message
export const sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const studentDbId = req.user.id; // ✅ Get the database ID from the JWT
    // DEBUG: Log the ID being used for the database query
    console.log(`Attempting to find student with database ID: ${studentDbId}`);
    
    if (!studentDbId) return res.status(403).json({ error: "Only students can chat" });

    // ✅ FIX: Fetch student data from the DATABASE, not the JSON file
    const studentData = await Student.findById(studentDbId);
    if (!studentData) {
      // This is where the error is triggered
      console.error(`Error: No student found with ID: ${studentDbId}`);
      return res.status(404).json({ error: "Student data not found in database" });
    }

    let chat = await Chat.findOne({ userId: studentDbId });
    if (!chat) chat = await Chat.create({ userId: studentDbId, messages: [] });

    chat.messages.push({ role: "user", content: message });

    // ✅ FIX: System prompt now uses live data from the database
    const systemPrompt = `
You are a helpful student assistant and counsellor.
Given below are the details of student of whom you are counsellor:
- Name: ${studentData.name}
- Student ID: ${studentData.studentId}
- Attendance: ${studentData.attendance_pct}%
- Last Test Score: ${studentData.last_test_score}
- Fee Status: ${studentData.fee_status} (Due: ₹${studentData.fee_due_amount})
- Mentor: ${studentData.mentor_name} (${studentData.mentor_email})
- Weekly Scores: ${studentData.weekly_scores.join(", ")}
- Risk Level: ${studentData.risk_level}
- Attempts (Math, Physics, Chemistry, English): ${studentData.attempts_math}, ${studentData.attempts_physics}, ${studentData.attempts_chemistry}, ${studentData.attempts_english}
Respond helpfully and only to the topic asked.You are a counsellor so answer only on these specific topics.So your conversation with student begins now.Dont give message first let the student ask first.
`;

    const messagesForAPI = [
      { role: "system", content: systemPrompt },
      ...chat.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // 🔹 Call Groq API
    const apiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Using a recommended model
        messages: messagesForAPI,
        max_tokens: 300,
      }),
    });

    const data = await apiRes.json();
    
    if (!apiRes.ok) {
        console.error("API Error Response:", JSON.stringify(data, null, 2));
        return res.status(502).json({ error: "Failed to get response from AI model."})
    }
    
    const botReply = data?.choices?.[0]?.message?.content || "⚠️ No reply from model";

    chat.messages.push({ role: "assistant", content: botReply });
    await chat.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Error processing chat" });
  }
};

