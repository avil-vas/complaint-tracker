import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const getPublicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department ?? null
})

export const signup = async (req, res) => {

  try {

    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student"
    })

    res.status(201).json({
      message: "Signup successful",
      user: getPublicUser(user)
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}



export const login = async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      })
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return res.status(400).json({
        message: "Invalid password"
      })
    }

    if (user.role === "admin" && user.adminProvisioned !== true) {
      return res.status(403).json({
        message: "Admin account requires re-provisioning by a superadmin"
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        adminProvisioned: user.adminProvisioned === true
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      message: "Login successful",
      user: getPublicUser(user)
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}

export const createAdmin = async (req, res) => {

  try {

    const { name, email, password, department } = req.body
    const allowedDepartments = [
      "maintenance",
      "hostel",
      "academic",
      "canteen",
      "student welfare",
      "administration"
    ]
    const normalizedDepartment = typeof department === "string"
      ? department.toLowerCase().trim()
      : ""

    if (!allowedDepartments.includes(normalizedDepartment)) {
      return res.status(400).json({
        message: "Invalid department"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      adminProvisioned: true,
      department: normalizedDepartment
    })

    res.status(201).json({
      message: "Admin created successfully",
      user: getPublicUser(user)
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}



export const logout = async (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  })

  res.json({
    message: "Logout successful"
  })

}



export const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    res.json({
      user
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error"
    })

  }

}