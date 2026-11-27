import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {

  try {

    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Authentication required: no token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.role === "admin" && decoded.adminProvisioned !== true) {
      return res.status(403).json({
        message: "Admin account requires re-provisioning by a superadmin"
      })
    }

    req.user = decoded

    next()

  } catch (error) {

    console.log("JWT ERROR:", error.message)

    return res.status(401).json({
      message: "Invalid token"
    })

  }

}

export default authMiddleware