import Complaint from "../models/Complaint.js"
import User from "../models/User.js"
import { sendComplaintConfirmation, sendStatusUpdate } from "../utils/emailService.js"


// Local keyword-based fallback classifier in case the Gemini API is offline/unavailable
const getFallbackClassification = (text) => {
  const lowerText = (text || "").toLowerCase();
  
  let category = "Other";
  let department = "administration";
  let priority = "medium";
  let sentiment = "neutral";

  // Category & Department keywords
  if (lowerText.includes("hostel") || lowerText.includes("room") || lowerText.includes("warden") || lowerText.includes("hostelite")) {
    category = "Hostel";
    department = "hostel";
  } else if (lowerText.includes("canteen") || lowerText.includes("food") || lowerText.includes("mess") || lowerText.includes("lunch") || lowerText.includes("dinner")) {
    category = "Canteen";
    department = "canteen";
  } else if (lowerText.includes("exam") || lowerText.includes("class") || lowerText.includes("academic") || lowerText.includes("course") || lowerText.includes("professor") || lowerText.includes("syllabus") || lowerText.includes("teacher") || lowerText.includes("grading")) {
    category = "Academic";
    department = "academic";
  } else if (lowerText.includes("water") || lowerText.includes("electricity") || lowerText.includes("wifi") || lowerText.includes("fan") || lowerText.includes("maintenance") || lowerText.includes("infrastructure") || lowerText.includes("broken") || lowerText.includes("leak") || lowerText.includes("plumber")) {
    category = "Infrastructure";
    department = "maintenance";
  } else if (lowerText.includes("harass") || lowerText.includes("ragging") || lowerText.includes("bully") || lowerText.includes("threat") || lowerText.includes("abuse")) {
    category = "Harassment";
    department = "student welfare";
    priority = "high";
  }

  // Priority keywords
  if (lowerText.includes("urgent") || lowerText.includes("emergency") || lowerText.includes("immediately") || lowerText.includes("danger") || lowerText.includes("asap")) {
    priority = "high";
  } else if (lowerText.includes("slow") || lowerText.includes("minor") || lowerText.includes("could you") || lowerText.includes("request")) {
    priority = "low";
  }

  // Sentiment keywords
  if (lowerText.includes("bad") || lowerText.includes("worst") || lowerText.includes("angry") || lowerText.includes("terrible") || lowerText.includes("hate") || lowerText.includes("poor") || lowerText.includes("unhappy")) {
    sentiment = "negative";
  } else if (lowerText.includes("good") || lowerText.includes("great") || lowerText.includes("happy") || lowerText.includes("satisfied") || lowerText.includes("perfect")) {
    sentiment = "positive";
  }

  return { category, department, priority, sentiment };
};


// CREATE COMPLAINT
export const createComplaint = async (req, res) => {

  try {

    const { complaint_text } = req.body

    let aiData;
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze the following student complaint and classify its category, department, priority level, and sentiment:
Complaint: "${complaint_text}"`
              }]
            }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "object",
                properties: {
                  category: { type: "string", enum: ["Hostel", "Academic", "Infrastructure", "Canteen", "Harassment", "Other"] },
                  department: { type: "string", enum: ["hostel", "academic", "maintenance", "canteen", "student welfare", "administration"] },
                  priority: { type: "string", enum: ["low", "medium", "high"] },
                  sentiment: { type: "string", enum: ["negative", "neutral", "positive"] }
                },
                required: ["category", "department", "priority", "sentiment"]
              }
            }
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;
        aiData = JSON.parse(aiText);
      } catch (err) {
        console.error("Gemini API call failed, using fallback parsing:", err);
        aiData = getFallbackClassification(complaint_text);
      }
    } else {
      console.warn("GEMINI_API_KEY not found in environment, using fallback classification.");
      aiData = getFallbackClassification(complaint_text);
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      complaint_text,
      category: aiData.category,
      department: aiData.department.toLowerCase().trim(),
      priority: aiData.priority,
      sentiment: aiData.sentiment,
      status: "Pending"
    })

    res.json(complaint)

    // Send confirmation email asynchronously without blocking the response
    User.findById(req.user.id)
      .then(student => {
        if (student && student.email) {
          sendComplaintConfirmation(
            student.email,
            student.name,
            complaint._id,
            complaint.category,
            complaint.priority
          )
        }
      })
      .catch(err => {
        console.error("Error retrieving user for confirmation email:", err);
      })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Error creating complaint"
    })

  }

}



// GET STUDENT COMPLAINTS
export const getMyComplaints = async (req, res) => {

  try {

    const complaints = await Complaint
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })

    res.json(complaints)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Error fetching complaints"
    })

  }

}



// GET ADMIN DEPARTMENT COMPLAINTS
export const getDepartmentComplaints = async (req, res) => {

  try {

    // get admin from DB
    const user = await User.findById(req.user.id)

    // If superadmin, return ALL complaints across departments
    if (user.role === "superadmin") {
      const complaints = await Complaint.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })

      return res.json(complaints)
    }

    const adminDept = user.department.toLowerCase().trim()

    const complaints = await Complaint.find({
      department: { $regex: adminDept, $options: "i" }
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json(complaints)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Error fetching department complaints"
    })

  }

}



// GET ALL COMPLAINTS (SUPERADMIN)
export const getAllComplaints = async (req, res) => {

  try {

    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })

    res.json(complaints)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Error fetching all complaints"
    })

  }

}



// GET ALL ADMINS (SUPERADMIN)
export const getAllAdmins = async (req, res) => {

  try {

    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 })

    res.json(admins)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Error fetching admins"
    })

  }

}



// DELETE ADMIN (SUPERADMIN)
export const deleteAdmin = async (req, res) => {

  try {

    const admin = await User.findById(req.params.id)

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      })
    }

    if (admin.role !== "admin") {
      return res.status(400).json({
        message: "User is not an admin"
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({
      message: "Admin deleted successfully"
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Error deleting admin"
    })

  }

}



// UPDATE COMPLAINT STATUS


// UPDATE COMPLAINT STATUS
export const updateComplaintStatus = async (req, res) => {

  try {

    const { status } = req.body

    console.log("Updating complaint:", req.params.id)
    console.log("New status:", status)

    // Retrieve old status and populate user profile details before updating
    const oldComplaint = await Complaint.findById(req.params.id).populate("user")

    if (!oldComplaint) {
      return res.status(404).json({
        message: "Complaint not found"
      })
    }

    const oldStatus = oldComplaint.status

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after' }
    )

    res.json(complaint)

    // Send status update email asynchronously
    if (oldComplaint.user && oldComplaint.user.email) {
      sendStatusUpdate(
        oldComplaint.user.email,
        oldComplaint.user.name,
        complaint._id,
        oldStatus,
        status,
        complaint.department
      )
    }

  } catch (error) {

    console.log("Update error:", error)

    res.status(500).json({
      message: "Error updating complaint status"
    })

  }

}