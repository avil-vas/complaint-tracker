import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["student", "admin", "superadmin"],
    default: "student"
  },

  department: {
    type: String,
    enum: [
      "maintenance",
      "hostel",
      "academic",
      "canteen",
      "student welfare",
      "administration"
    ],
    default: "administration"
  }

}, { timestamps: true })

export default mongoose.model("User", userSchema)