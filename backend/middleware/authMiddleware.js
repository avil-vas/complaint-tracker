import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {

  try {

    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Authentication required: no token provided" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

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