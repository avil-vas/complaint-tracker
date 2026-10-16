import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function ProtectedRoute({ children, role }) {

  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef4ff]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  return children

}

export default ProtectedRoute