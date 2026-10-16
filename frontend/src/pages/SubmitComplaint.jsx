import { useState } from "react"

function SubmitComplaint({ refresh }) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const maxLength = 600

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)

    try {
      const res = await fetch(
        "http://localhost:3000/api/complaints/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            complaint_text: text
          })
        }
      )
      await res.json()
      setText("")
      refresh()
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
            Submit New Complaint
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">File a new issue and trace its routing process</p>
        </div>

        {/* AI routing alert */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100 self-start md:self-auto">
          <svg className="w-4 h-4 text-violet-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI-Powered Auto Routing Enabled
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="complaint-text" className="block text-sm font-semibold text-slate-600 mb-2">
            Describe your issue in detail
          </label>
          <textarea
            id="complaint-text"
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= maxLength) {
                setText(e.target.value)
              }
            }}
            placeholder="What is the concern? Please describe the issue clearly (e.g., canteen hygiene, hostel wifi issues, etc.) so our AI can accurately classify and route it..."
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none text-slate-700 placeholder-slate-400 leading-relaxed text-sm shadow-inner"
            required
          />

          {/* Character count */}
          <div className="absolute bottom-3 right-3 text-xs font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-slate-400 flex gap-1 items-center">
            <span className={text.length >= maxLength - 50 ? "text-amber-500 font-semibold" : "text-slate-500"}>
              {text.length}
            </span>
            <span>/</span>
            <span>{maxLength}</span>
          </div>
        </div>

        {/* AI Info Alert Bar */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200/50 p-4 flex gap-3 text-xs text-slate-500 leading-relaxed items-start">
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-slate-700">How it works:</span> Google Gemini parses your text immediately upon submission. It determines the category, priority level, and sentiment of the complaint to dispatch it automatically to the relevant administrative department.
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98] flex items-center justify-center ${loading || !text.trim()
                ? 'bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing AI Routing...
              </span>
            ) : (
              'Submit Complaint'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubmitComplaint