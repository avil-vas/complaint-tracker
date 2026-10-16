import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function AdminLayout({ children }) {

  return (
    <div className="min-h-screen bg-[#eef4ff] text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <main className="px-4 pb-8 pt-4 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )

}

export default AdminLayout