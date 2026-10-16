import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const superadminLinks = [
  {
    to: "/superadmin",
    label: "Overview",
    description: "All departments at a glance",
    exact: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
      </svg>
    )
  },
  {
    to: "/superadmin/admins",
    label: "Admin Management",
    description: "View and manage department admins",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    )
  }
]

const adminLinks = [
  {
    to: "/admin",
    label: "Overview",
    description: "Department complaint snapshot",
    exact: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 6.75h15m-15 5.25h10.5m-10.5 5.25h15" />
      </svg>
    )
  },
  {
    to: "/admin/complaints",
    label: "Complaint Queue",
    description: "Update status and priorities",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6M8.25 4.5h7.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-7.5A2.25 2.25 0 0 1 6 17.25V6.75A2.25 2.25 0 0 1 8.25 4.5Z" />
      </svg>
    )
  }
]

const studentLinks = [
  {
    to: "/student",
    label: "Overview",
    description: "See your current complaints",
    exact: true,
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 12h16.5m-16.5 6.75h16.5m-16.5-13.5h16.5" />
      </svg>
    )
  },
  {
    to: "/student/submit",
    label: "Submit Complaint",
    description: "Raise a new issue",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    )
  }
]

function SidebarLink({ link }) {

  return (
    <NavLink
      to={link.to}
      end={link.exact}
      className={({ isActive }) =>
        [
          "min-w-[220px] rounded-[24px] border px-4 py-4 transition duration-200 lg:min-w-0",
          isActive
            ? "border-[#1d4ed8] bg-[#1d4ed8] text-white shadow-[0_18px_45px_-28px_rgba(29,78,216,0.65)]"
            : "border-[#dbe7ff] bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:border-[#1e40af] hover:bg-white"
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <div className="flex items-start gap-3">
          <div className={[
            "mt-0.5 rounded-2xl p-2",
            isActive ? "bg-white/15 text-white" : "bg-[#e0eaff] text-[#1d4ed8]"
          ].join(" ")}>
            {link.icon}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {link.label}
            </p>
            <p className={[
              "mt-1 text-xs leading-5",
              isActive ? "text-white/80" : "text-slate-500"
            ].join(" ")}>
              {link.description}
            </p>
          </div>
        </div>
      )}
    </NavLink>
  )

}

function Sidebar() {

  const { user } = useContext(AuthContext)

  const links = user?.role === "superadmin"
    ? superadminLinks
    : user?.role === "admin"
      ? adminLinks
      : studentLinks

  const workspaceTitle = user?.role === "superadmin"
    ? "Super Admin"
    : user?.role === "admin"
      ? "Admin workspace"
      : "Student space"

  const workspaceDesc = user?.role === "superadmin"
    ? "Oversee all departments, manage admins, and monitor every complaint across the entire system."
    : user?.role === "admin"
      ? "Run intake, prioritisation, and status updates from one polished control surface."
      : "Track issue progress and create new requests without losing context."

  const roleLabel = user?.role === "superadmin" ? "super admin" : (user?.role || "Member")

  return (

    <aside className="w-full border-b border-[#dbe7ff]/90 bg-[#f8fbff] lg:w-[20rem] lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4 sm:p-6">

        <div className={[
          "rounded-[28px] p-6 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.85)]",
          user?.role === "superadmin"
            ? "bg-[linear-gradient(135deg,#1e1b4b_0%,#7c3aed_56%,#a78bfa_100%)]"
            : "bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_56%,#0ea5e9_100%)]"
        ].join(" ")}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/70">
            Complaint tracker
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            {workspaceTitle}
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/80">
            {workspaceDesc}
          </p>

          <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            {roleLabel}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1e40af]">
            Navigation
          </p>

          <nav className="mt-4 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {links.map((link) => (
              <SidebarLink key={link.to} link={link} />
            ))}
          </nav>
        </div>

        <div className="mt-6 rounded-[24px] border border-[#dbe7ff] bg-white/85 p-5 shadow-sm lg:mt-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1e40af]">
            Focus
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep complaint communication clear, prioritise urgent blockers, and maintain visible progress for every case.
          </p>
        </div>

      </div>
    </aside>

  )
}

export default Sidebar