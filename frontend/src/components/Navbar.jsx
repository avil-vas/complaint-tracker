import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const pageCopy = {
  "/admin": {
    label: "Admin workspace",
    title: "Department Complaints",
    subtitle: "Review active cases, triage priority work, and keep turnaround steady."
  },
  "/admin/complaints": {
    label: "Queue management",
    title: "Complaint Queue",
    subtitle: "Search, sort, and update live cases without leaving the workstream."
  },
  "/superadmin": {
    label: "Super admin command center",
    title: "System Overview",
    subtitle: "Monitor all complaints across every department, manage admins, and keep the entire system running smoothly."
  },
  "/superadmin/admins": {
    label: "Admin management",
    title: "Department Admins",
    subtitle: "View, monitor, and manage all department administrators from one place."
  }
}

function getPageDetails(pathname) {

  if (pathname.startsWith("/superadmin/admins")) {
    return pageCopy["/superadmin/admins"]
  }

  if (pathname.startsWith("/superadmin")) {
    return pageCopy["/superadmin"]
  }

  if (pathname.startsWith("/admin/complaints")) {
    return pageCopy["/admin/complaints"]
  }

  return pageCopy["/admin"]

}

function Navbar() {

  const { logout, user } = useContext(AuthContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const pageDetails = getPageDetails(pathname)
  const departmentLabel = user?.role === "superadmin" ? "All departments" : (user?.department ? `${user.department} desk` : "Operations desk")
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "A"
  const roleDisplayLabel = user?.role === "superadmin" ? "Super Administrator" : "Administrator"
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric"
  })

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="border-b border-[#dbe7ff]/90 bg-[#f8fbff]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">

        <div className="flex items-start gap-4">
          <div className="hidden h-14 w-14 items-center justify-center rounded-[20px] bg-[#1d4ed8] shadow-[0_18px_40px_-24px_rgba(29,78,216,0.75)] sm:flex">
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75 11.25 15 15 9.75m5.25 2.25a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z" />
            </svg>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#1e40af]">
              {pageDetails.label}
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {pageDetails.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {pageDetails.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-[#dbe7ff] bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1e40af]">
              Today
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formattedDate}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dbe7ff] bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1e40af]">
              Desk
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-900">
              {departmentLabel}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#dbe7ff] bg-white/90 px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d4ed8] text-sm font-bold text-white">
              {userInitial}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                {roleDisplayLabel}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-[#1d4ed8] bg-[#1d4ed8] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#1e40af]"
          >
            Sign out
          </button>
        </div>

      </div>
    </header>
  )
}

export default Navbar