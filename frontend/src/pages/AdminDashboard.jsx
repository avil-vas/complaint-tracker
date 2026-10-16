import { useEffect, useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { getPriorityClasses, getStatusClasses, normalisePriority, statusOptions } from "../components/adminTheme"

function AdminDashboard() {

  const [complaints, setComplaints] = useState([])
  const [activeStatus, setActiveStatus] = useState("All")

  const fetchComplaints = async () => {

    try {

      const res = await fetch(
        "http://localhost:3000/api/complaints/department",
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

  const updateStatus = async (id, status) => {

    console.log("Updating:", id, status)

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

      console.log("Server response:", data)

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
  }, [])

  const pendingCount = complaints.filter((complaint) => complaint.status === "Pending").length
  const inProgressCount = complaints.filter((complaint) => complaint.status === "In Progress").length
  const resolvedCount = complaints.filter((complaint) => complaint.status === "Resolved").length
  const highPriorityCount = complaints.filter((complaint) => normalisePriority(complaint.priority) === "High").length
  const completionRate = complaints.length === 0 ? 0 : Math.round((resolvedCount / complaints.length) * 100)

  const visibleComplaints = activeStatus === "All"
    ? complaints
    : complaints.filter((complaint) => complaint.status === activeStatus)

  const priorityBreakdown = complaints.reduce((accumulator, complaint) => {
    const key = normalisePriority(complaint.priority)

    accumulator[key] = (accumulator[key] || 0) + 1

    return accumulator
  }, {
    High: 0,
    Medium: 0,
    Low: 0,
    Unassigned: 0
  })

  const topCategories = Object.entries(
    complaints.reduce((accumulator, complaint) => {
      const key = complaint.category || "Other"

      accumulator[key] = (accumulator[key] || 0) + 1

      return accumulator
    }, {})
  ).sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]).slice(0, 5)

  const summaryCards = [
    {
      label: "Open cases",
      value: complaints.length,
      accent: "border-white/20 bg-white/10 text-white"
    },
    {
      label: "Pending review",
      value: pendingCount,
      accent: "border-amber-200/50 bg-amber-100/15 text-white"
    },
    {
      label: "In progress",
      value: inProgressCount,
      accent: "border-sky-200/50 bg-sky-100/15 text-white"
    },
    {
      label: "High priority",
      value: highPriorityCount,
      accent: "border-rose-200/50 bg-rose-100/15 text-white"
    }
  ]

  return (

    <AdminLayout>

      <section className="relative overflow-hidden rounded-[32px] border border-[#dbe7ff] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#0ea5e9_100%)] px-6 py-7 text-white shadow-[0_35px_80px_-48px_rgba(15,23,42,0.75)] sm:px-8 sm:py-9">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_68%)] lg:block" />

        <div className="relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
              Operations brief
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Department complaints
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Live queue, priority pressure, and case progress in one place.
            </p>

            <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
              Current closure rate: {completionRate}%
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.label} className={[
                "rounded-[24px] border p-5 shadow-[0_15px_35px_-25px_rgba(15,23,42,0.9)] backdrop-blur-sm",
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
        <section className="rounded-[30px] border border-[#dbe7ff] bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[#e5edff] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1e40af]">
                Live queue
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Complaints needing action
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
                      ? "bg-[#1d4ed8] text-white shadow-[0_12px_30px_-18px_rgba(29,78,216,0.65)]"
                      : "bg-[#eef4ff] text-slate-600 hover:bg-[#dbeafe]"
                  ].join(" ")}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {visibleComplaints.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dbe7ff] bg-[#f8fbff] px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e0eaff] text-[#1d4ed8]">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2.25-9.75v11.25A2.25 2.25 0 0 1 15 19.5H9A2.25 2.25 0 0 1 6.75 17.25V6.75A2.25 2.25 0 0 1 9 4.5h6A2.25 2.25 0 0 1 17.25 6.75Z" />
                </svg>
              </div>
              <h4 className="mt-5 text-xl font-semibold text-slate-900">
                No complaints match this view
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try another status filter or wait for new complaints to arrive in the queue.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:hidden">
                {visibleComplaints.map((complaint) => (
                  <div key={complaint._id} className="rounded-[24px] border border-[#e5edff] bg-[#f8fbff] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">
                          {complaint.user?.name || "Unknown student"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {complaint.category || "General"}
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
                        onChange={(event) => updateStatus(complaint._id, event.target.value)}
                        className="rounded-2xl border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/15"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 hidden overflow-x-auto md:block">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Student</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Complaint</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Category</th>
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
                            Assigned case
                          </p>
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-top text-sm leading-6 text-slate-600">
                          {complaint.complaint_text}
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-top">
                          <span className="rounded-full bg-[#e0eaff] px-3 py-1 text-sm font-semibold text-[#1d4ed8]">
                            {complaint.category || "General"}
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
                              onChange={(event) => updateStatus(complaint._id, event.target.value)}
                              className="rounded-2xl border border-[#dbe7ff] bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/15"
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

        <div className="grid gap-6">
          <section className="rounded-[28px] border border-[#dbe7ff] bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1e40af]">
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
                    <div className="mt-2 h-2.5 rounded-full bg-[#e0eaff]">
                      <div
                        className="h-2.5 rounded-full bg-[#1d4ed8] transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#dbe7ff] bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1e40af]">
              Category mix
            </p>
            <div className="mt-5 space-y-4">
              {topCategories.length === 0 ? (
                <p className="text-sm leading-6 text-slate-500">
                  Category data will appear here when complaints are available.
                </p>
              ) : (
                topCategories.map(([category, count], index) => (
                  <div key={category} className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {index + 1}. {category}
                      </p>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Active share
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-[#1d4ed8]">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#1d4ed8] bg-[#1d4ed8] p-6 text-white shadow-[0_24px_60px_-45px_rgba(15,23,42,0.7)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
              Service note
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {resolvedCount}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              complaints are resolved. {pendingCount} still need initial review and {inProgressCount} are currently being worked on.
            </p>
          </section>
        </div>
      </div>

    </AdminLayout>

  )

}

export default AdminDashboard