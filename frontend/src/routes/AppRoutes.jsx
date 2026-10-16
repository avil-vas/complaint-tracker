import { Routes, Route } from "react-router-dom"

import Login from "../pages/Login"
import Signup from "../pages/Signup"

import StudentDashboard from "../pages/StudentDashboard"
import SubmitComplaint from "../pages/SubmitComplaint"

import AdminDashboard from "../pages/AdminDashboard"
import ComplaintTable from "../components/ComplaintTable"

import SuperAdminDashboard from "../pages/SuperAdminDashboard"
import AdminManagement from "../pages/AdminManagement"

import ProtectedRoute from "../components/ProtectedRoute"

function AppRoutes() {

  return (

    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/submit"
        element={
          <ProtectedRoute role="student">
            <SubmitComplaint />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute role="admin">
            <ComplaintTable />
          </ProtectedRoute>
        }
      />

      {/* Super Admin */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute role="superadmin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/admins"
        element={
          <ProtectedRoute role="superadmin">
            <AdminManagement />
          </ProtectedRoute>
        }
      />

    </Routes>

  )
}

export default AppRoutes