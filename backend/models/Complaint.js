import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  complaint_text: {
    type: String,
    required: true
  },

  category: String,
  department: String,
  priority: String,
  sentiment: String,

  status: {
    type: String,
    default: "Pending"
  }

}, { timestamps: true })

export default mongoose.model("Complaint", complaintSchema)