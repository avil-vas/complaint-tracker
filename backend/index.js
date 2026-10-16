import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import complaintRoutes from "./routes/complaintRoutes.js"

dotenv.config()

const app = express()

// CORS FIX
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(cookieParser())
app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/complaints", complaintRoutes)

app.get("/", (req, res) => {
  res.send("Server running")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})