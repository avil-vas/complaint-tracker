import { useEffect, useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { getPriorityClasses, getStatusClasses, normalisePriority, statusOptions } from "../components/adminTheme"

function SuperAdminDashboard() {

  const [complaints, setComplaints] = useState([])
  const [admins, setAdmins] = useState([])
  const [activeStatus, setActiveStatus] = useState("All")

  const fetchComplaints = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/api/complaints/all",
        {
          credentials: "include"
        }
      )

      const data = await res.json()

      setComplaints(data)

    } catch (error) {

      console.log(error)

    }

  }

  const fetchAdmins = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/api/complaints/admins",
        {
          credentials: "include"
        }
      )

      const data = await res.json()

      setAdmins(data)

    } catch (error) {

      console.log(error)

    }

  }

  const updateStatus = async (id, status) => {

    try {

      const res = await fetch(
        `http://localhost:3000/api/complaints/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ status })
        }
      )

      const data = await res.json()

      setComplaints(prev =>
        prev.map(c =>
          c._id === id ? { ...c, status: data.status } : c
        )
      )

    } catch (error) {

      console.log("Update error:", error)

    }

  }

  useEffect(() => {
    fetchComplaints()
    fetchAdmins()
  }, [])

  const pendingCount = complaints.filter((c) => c.status === "Pending").length
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length
  const highPriorityCount = complaints.filter((c) => normalisePriority(c.priority) === "High").length
  const completionRate = complaints.length === 0 ? 0 : Math.round((resolvedCount / complaints.length) * 100)

  const visibleComplaints = activeStatus === "All"
    ? complaints
    : complaints.filter((c) => c.status === activeStatus)

  // Department-wise breakdown
  const departmentBreakdown = complaints.reduce((acc, c) => {
    const dept = c.department || "other"
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {})

  const priorityBreakdown = complaints.reduce((acc, c) => {
    const key = normalisePriority(c.priority)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, { High: 0, Medium: 0, Low: 0, Unassigned: 0 })

  const summaryCards = [
    {
      label: "Total complaints",
      value: complaints.length,
      accent: "border-white/20 bg-white/10 text-white"
    },
    {
      label: "Active admins",
      value: admins.length,
      accent: "border-emerald-200/50 bg-emerald-100/15 text-white"
    },
    {
      label: "Pending review",
      value: pendingCount,
      accent: "border-amber-200/50 bg-amber-100/15 text-white"
    },
    {
      label: "High priority",
      value: highPriorityCount,
      accent: "border-rose-200/50 bg-rose-100/15 text-white"
    }
  ]

  return (

    <AdminLayout>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#c4b5fd] bg-[linear-gradient(135deg,#1e1b4b_0%,#7c3aed_58%,#a78bfa_100%)] px-6 py-7 text-white shadow-[0_35px_80px_-48px_rgba(30,27,75,0.75)] sm:px-8 sm:py-9">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_68%)] lg:block" />

        <div className="relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
              Super admin command center
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              System-wide overview
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              All departments, all complaints, all admins — oversee the entire complaint management system.
            </p>

            <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              System closure rate: {completionRate}%
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.label} className={[
                "rounded-[24px] border p-5 shadow-[0_15px_35px_-25px_rgba(30,27,75,0.9)] backdrop-blur-sm",
                card.accent
              ].join(" ")}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">

        {/* Complaint Table */}
        <section className="rounded-[30px] border border-[#dbe7ff] bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[#e5edff] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c3aed]">
                All departments
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                System-wide complaints
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", ...statusOptions].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveStatus(status)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition duration-200",
                    activeStatus === status
                      ? "bg-[#7c3aed] text-white shadow-[0_12px_30px_-18px_rgba(124,58,237,0.65)]"
                      : "bg-[#f3f0ff] text-slate-600 hover:bg-[#ede9fe]"
                  ].join(" ")}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {visibleComplaints.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dbe7ff] bg-[#f8fbff] px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed]">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2.25-9.75v11.25A2.25 2.25 0 0 1 15 19.5H9A2.25 2.25 0 0 1 6.75 17.25V6.75A2.25 2.25 0 0 1 9 4.5h6A2.25 2.25 0 0 1 17.25 6.75Z" />
                </svg>
              </div>
              <h4 className="mt-5 text-xl font-semibold text-slate-900">
                No complaints match this view
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try another status filter or wait for new complaints to arrive.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="mt-6 grid gap-4 md:hidden">
                {visibleComplaints.map((complaint) => (
                  <div key={complaint._id} className="rounded-[24px] border border-[#e5edff] bg-[#f8fbff] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {complaint.user?.name || "Unknown student"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {complaint.category || "General"} · <span className="capitalize">{complaint.department || "N/A"}</span>
                        </p>
                      </div>

                      <span className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        getPriorityClasses(complaint.priority)
                      ].join(" ")}>
                        {normalisePriority(complaint.priority)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {complaint.complaint_text}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        getStatusClasses(complaint.status)
                      ].join(" ")}>
                        {complaint.status}
                      </span>

                      <select
                        value={complaint.status}
                        onChange={(e) => updateStatus(complaint._id, e.target.value)}
                        className="rounded-2xl border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="mt-6 hidden overflow-x-auto md:block">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Complaint</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Priority</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleComplaints.map((complaint) => (
                      <tr key={complaint._id} className="rounded-[24px] bg-[#f8fbff] shadow-[0_15px_40px_-35px_rgba(15,23,42,0.7)]">
                        <td className="rounded-l-[24px] border-y border-l border-[#e5edff] px-4 py-4 align-top">
                          <p className="font-semibold text-slate-900">
                            {complaint.user?.name || "Unknown student"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {complaint.user?.email || ""}
                          </p>
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-top text-sm leading-6 text-slate-600">
                          {complaint.complaint_text}
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-top">
                          <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-sm font-semibold capitalize text-[#7c3aed]">
                            {complaint.department || "N/A"}
                          </span>
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-top">
                          <span className={[
                            "rounded-full border px-3 py-1 text-sm font-semibold",
                            getPriorityClasses(complaint.priority)
                          ].join(" ")}>
                            {normalisePriority(complaint.priority)}
                          </span>
                        </td>

                        <td className="rounded-r-[24px] border-y border-r border-[#e5edff] px-4 py-4 align-top">
                          <div className="flex flex-col gap-3">
                            <span className={[
                              "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold",
                              getStatusClasses(complaint.status)
                            ].join(" ")}>
                              {complaint.status}
                            </span>

                            <select
                              value={complaint.status}
                              onChange={(e) => updateStatus(complaint._id, e.target.value)}
                              className="rounded-2xl border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15"
                            >
                              {statusOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Right sidebar panels */}
        <div className="grid gap-6">

          {/* Department breakdown */}
          <section className="rounded-[28px] border border-[#dbe7ff] bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c3aed]">
              Department load
            </p>
            <div className="mt-5 space-y-4">
              {Object.entries(departmentBreakdown).sort((a, b) => b[1] - a[1]).map(([dept, count]) => {
                const percentage = complaints.length === 0 ? 0 : Math.round((count / complaints.length) * 100)
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="capitalize">{dept}</span>
                      <span>{count}</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-[#ede9fe]">
                      <div
                        className="h-2.5 rounded-full bg-[#7c3aed] transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Priority radar */}
          <section className="rounded-[28px] border border-[#dbe7ff] bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c3aed]">
              Priority radar
            </p>
            <div className="mt-5 space-y-4">
              {["High", "Medium", "Low", "Unassigned"].map((priority) => {
                const count = priorityBreakdown[priority] || 0
                const percentage = complaints.length === 0 ? 0 : Math.round((count / complaints.length) * 100)

                return (
                  <div key={priority}>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{priority}</span>
                      <span>{count}</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-[#ede9fe]">
                      <div
                        className="h-2.5 rounded-full bg-[#7c3aed] transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Status summary */}
          <section className="rounded-[28px] border border-[#7c3aed] bg-[#7c3aed] p-6 text-white shadow-[0_24px_60px_-45px_rgba(30,27,75,0.7)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
              System pulse
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {resolvedCount}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              complaints resolved system-wide. {pendingCount} still need initial review, {inProgressCount} are in progress, and {admins.length} admins are active.
            </p>
          </section>

        </div>
      </div>

    </AdminLayout>

  )

}

export default SuperAdminDashboard
