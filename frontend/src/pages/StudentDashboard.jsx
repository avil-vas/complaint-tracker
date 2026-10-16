import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import ComplaintCard from "../components/ComplaintCard"
import SubmitComplaint from "./SubmitComplaint"

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [complaints, setComplaints] = useState([])

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const fetchComplaints = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/complaints/my",
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

  useEffect(() => {
    fetchComplaints()
  }, [])

  // Calculate stats
  const totalCount = complaints.length
  const pendingCount = complaints.filter(c => c.status?.toLowerCase() === "pending").length
  const progressCount = complaints.filter(c => c.status?.toLowerCase() === "in-progress" || c.status?.toLowerCase() === "in progress").length
  const resolvedCount = complaints.filter(c => c.status?.toLowerCase() === "resolved").length

  // Filter logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      (c.complaint_text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.department || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" ||
      (c.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory = categoryFilter === "all" ||
      (c.category || "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  })

  // List of unique categories for dropdown filter
  const categoriesList = ["Hostel", "Academic", "Infrastructure", "Canteen", "Harassment", "Other"]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-xl">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Student Center
              </h1>
              <p className="text-xs text-slate-500 font-medium">Issue Tracking & AI Routing</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
              <span className="text-xs text-slate-400 capitalize">{user?.role || "Student"}</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
            <button
              onClick={logout}
              className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-200/60 hover:border-red-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* HERO/WELCOME BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/10 mb-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Dashboard Overview
            </span>
            <h2 className="text-3xl font-extrabold mt-3 tracking-tight">
              Hello, {user?.name}!
            </h2>
            <p className="text-blue-100/90 mt-2 text-base leading-relaxed">
              Submit your concern below. Our system automatically categorizes, prioritizes, and routes complaints to respective cells using Google Gemini AI.
            </p>
          </div>
        </div>

        {/* METRICS STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Complaints</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalCount}</h3>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingCount}</h3>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{progressCount}</h3>
            </div>
          </div>

          {/* Card 4: Resolved */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{resolvedCount}</h3>
            </div>
          </div>
        </div>

        {/* SUBMIT COMPLAINT FORM */}
        <SubmitComplaint refresh={fetchComplaints} />

        {/* COMPLAINTS SECTION LIST WITH SEARCH & FILTERS */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
                My Complaint History
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Showing your filed tickets and their status updates</p>
            </div>

            {/* SEARCH AND FILTERS PANEL */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-grow sm:flex-grow-0">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-600"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-600"
              >
                <option value="all">All Categories</option>
                {categoriesList.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* COMPLAINTS RENDER */}
          <div className="grid gap-6">
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-semibold text-lg">No complaints found</p>
                <p className="text-slate-400 text-sm mt-1 px-4">
                  {complaints.length === 0
                    ? "Submit your first complaint using the form above to start tracking it."
                    : "Try adjusting your search query or filter options."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint._id}
                    complaint={complaint}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard