import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    mentorId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;

