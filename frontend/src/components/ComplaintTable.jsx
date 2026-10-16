import { useEffect, useState } from "react"
import AdminLayout from "./AdminLayout"
import { getPriorityClasses, getStatusClasses, normalisePriority, statusOptions } from "./adminTheme"

function ComplaintTable() {

  const [complaints, setComplaints] = useState([])
  const [query, setQuery] = useState("")
  const [activeStatus, setActiveStatus] = useState("All")

  const fetchComplaints = async () => {

    const res = await fetch(
      "http://localhost:3000/api/complaints/department",
      {
        credentials: "include"
      }
    )

    const data = await res.json()

    setComplaints(data)

  }

  const updateStatus = async (id, status) => {

    await fetch(
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

    fetchComplaints()

  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = activeStatus === "All" || complaint.status === activeStatus
    const searchValue = query.trim().toLowerCase()

    if (!searchValue) {
      return matchesStatus
    }

    const haystack = [
      complaint.user?.name,
      complaint.complaint_text,
      complaint.category,
      complaint.priority,
      complaint.status
    ].join(" ").toLowerCase()

    return matchesStatus && haystack.includes(searchValue)
  })

  const highPriorityCount = complaints.filter((complaint) => normalisePriority(complaint.priority) === "High").length
  const resolvedCount = complaints.filter((complaint) => complaint.status === "Resolved").length

  return (

    <AdminLayout>

      <section className="rounded-[30px] border border-[#dbe7ff] bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-6 border-b border-[#e5edff] pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1e40af]">
              Queue management
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Review, search, and update every complaint in one place.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use the search field and status filters to focus the queue without changing how data is requested from the backend.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[540px]">
            <label className="rounded-[24px] border border-[#dbe7ff] bg-[#f8fbff] px-4 py-3 sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1e40af]">
                Search complaints
              </span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by student, issue, category, or status"
                className="mt-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>

            <div className="rounded-[24px] border border-[#dbe7ff] bg-[#1d4ed8] px-4 py-3 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                Filtered
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {filteredComplaints.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#dbe7ff] bg-[#f8fbff] px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e40af]">Total cases</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{complaints.length}</p>
          </div>
          <div className="rounded-[24px] border border-[#dbe7ff] bg-[#f8fbff] px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e40af]">High priority</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{highPriorityCount}</p>
          </div>
          <div className="rounded-[24px] border border-[#dbe7ff] bg-[#f8fbff] px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e40af]">Resolved</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{resolvedCount}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
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

        {filteredComplaints.length === 0 ? (
          <div className="mt-6 flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dbe7ff] bg-[#f8fbff] px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e0eaff] text-[#1d4ed8]">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 6.75h7.5A2.25 2.25 0 0 1 18 9v6a2.25 2.25 0 0 1-2.25 2.25h-7.5A2.25 2.25 0 0 1 6 15V9a2.25 2.25 0 0 1 2.25-2.25Z" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">No complaints match your filters</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Adjust the current search or status selection to reveal more cases.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:hidden">
              {filteredComplaints.map((complaint) => (
                <div key={complaint._id} className="rounded-[24px] border border-[#e5edff] bg-[#f8fbff] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{complaint.user?.name || "Unknown student"}</p>
                      <p className="mt-1 text-sm text-slate-500">{complaint.category || "General"}</p>
                    </div>

                    <span className={[
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      getPriorityClasses(complaint.priority)
                    ].join(" ")}>
                      {normalisePriority(complaint.priority)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">{complaint.complaint_text}</p>

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
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="rounded-[24px] bg-[#f8fbff] shadow-[0_15px_40px_-35px_rgba(15,23,42,0.7)]">
                      <td className="rounded-l-[24px] border-y border-l border-[#e5edff] px-4 py-4 align-top">
                        <p className="font-semibold text-slate-900">{complaint.user?.name || "Unknown student"}</p>
                        <p className="mt-1 text-sm text-slate-500">Live case</p>
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

    </AdminLayout>

  )

}

export default ComplaintTable