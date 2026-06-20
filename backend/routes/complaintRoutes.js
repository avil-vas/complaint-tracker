import express from "express"

import {
  createComplaint,
  getMyComplaints,
  getDepartmentComplaints,
  getAllComplaints,
  getAllAdmins,
  deleteAdmin,
  updateComplaintStatus
} from "../controllers/complaintController.js"

import authMiddleware from "../middleware/authMiddleware.js"
import requireRole from "../middleware/roleMiddleware.js"

const router = express.Router()

// CREATE COMPLAINT
router.post("/create", authMiddleware, createComplaint)

// GET STUDENT COMPLAINTS
router.get("/my", authMiddleware, getMyComplaints)

// GET ADMIN DEPARTMENT COMPLAINTS
router.get("/department", authMiddleware, getDepartmentComplaints)

// GET ALL COMPLAINTS (SUPERADMIN)
router.get("/all", authMiddleware, requireRole("superadmin"), getAllComplaints)

// GET ALL ADMINS (SUPERADMIN)
router.get("/admins", authMiddleware, requireRole("superadmin"), getAllAdmins)

// DELETE ADMIN (SUPERADMIN)
router.delete("/admin/:id", authMiddleware, requireRole("superadmin"), deleteAdmin)

// UPDATE COMPLAINT STATUS
router.patch("/status/:id", authMiddleware, updateComplaintStatus)

export default router