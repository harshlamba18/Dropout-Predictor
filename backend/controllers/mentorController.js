import Mentor from "../models/Mentor.js";

// @desc    Get all mentors (for Admin)
// @route   GET /api/mentors
// @access  Private (Admin)
export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({}).select("-password -__v");
    res.json(mentors);
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single mentor's profile by their Mentor ID
// @route   GET /api/mentors/:mentorId
// @access  Private (Mentor/Admin)
export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ mentorId: req.params.mentorId }).select("-password -__v");
    if (mentor) {
      res.json(mentor);
    } else {
      res.status(404).json({ message: "Mentor not found" });
    }
  } catch (err) {
    console.error("Error fetching mentor profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

