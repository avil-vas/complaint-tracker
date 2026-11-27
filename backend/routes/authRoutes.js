import express from "express"
import {signup,login,logout,getMe,createAdmin} from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import requireRole from "../middleware/roleMiddleware.js"

const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/create-admin", authMiddleware, requireRole("superadmin"), createAdmin)
router.post("/logout",logout)
router.get("/me", authMiddleware, getMe)

export default router