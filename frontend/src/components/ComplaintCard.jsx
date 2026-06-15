function ComplaintCard({ complaint }) {

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Resolved
          </span>
        )
      case 'in-progress':
      case 'in progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            In Progress
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            Pending
          </span>
        )
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
            High Priority
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Medium Priority
          </span>
        )
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Low Priority
          </span>
        )
    }
  }

  const getSentimentBadge = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <span className="text-xs font-medium bg-emerald-50/50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100/50">😊 Positive</span>
      case 'negative':
        return <span className="text-xs font-medium bg-rose-50/50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100/50">😠 Negative</span>
      case 'neutral':
      default:
        return <span className="text-xs font-medium bg-slate-100/60 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/50">😐 Neutral</span>
    }
  }

  // Get dynamic category-specific SVG icon
  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("hostel")) {
      return (
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    }
    if (cat.includes("canteen") || cat.includes("food")) {
      return (
        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (cat.includes("academic") || cat.includes("class") || cat.includes("exam")) {
      return (
        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    if (cat.includes("harassment") || cat.includes("welfare")) {
      return (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative group overflow-hidden">
      
      {/* Top action/info row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/50">
            {getCategoryIcon(complaint.category)}
            {complaint.category || 'General'}
          </span>
          {getPriorityBadge(complaint.priority)}
        </div>
        <div>
          {getStatusBadge(complaint.status)}
        </div>
      </div>

      {/* Main complaint text content */}
      <div className="mb-5">
        <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
          {complaint.complaint_text}
        </p>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Routed Department</span>
          <span className="text-xs font-semibold text-slate-700 mt-1 capitalize">
            {complaint.department || 'General Admin'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Sentiment</span>
          <div className="mt-1 flex items-center">
            {getSentimentBadge(complaint.sentiment)}
          </div>
        </div>

        <div className="flex flex-col col-span-2 sm:col-span-1 justify-end items-start sm:items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted Date</span>
          <span className="text-xs font-medium text-slate-500 mt-1">
            {new Date(complaint.createdAt || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

    </div>
  )
}

export default ComplaintCard