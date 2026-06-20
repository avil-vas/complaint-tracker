import { useEffect, useState } from "react"
import AdminLayout from "../components/AdminLayout"

function AdminManagement() {

  const [admins, setAdmins] = useState([])
  const [deleting, setDeleting] = useState(null)

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

  const handleDelete = async (id, name) => {

    if (!window.confirm(`Are you sure you want to remove admin "${name}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(id)

    try {

      const res = await fetch(
        `http://localhost:3000/api/complaints/admin/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      )

      if (res.ok) {
        setAdmins(prev => prev.filter(a => a._id !== id))
      } else {
        const data = await res.json()
        alert(data.message || "Failed to delete admin")
      }

    } catch (error) {

      console.log("Delete error:", error)
      alert("Failed to delete admin")

    } finally {
      setDeleting(null)
    }

  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Department stats
  const departmentStats = admins.reduce((acc, admin) => {
    const dept = admin.department || "unassigned"
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {})

  return (

    <AdminLayout>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#c4b5fd] bg-[linear-gradient(135deg,#1e1b4b_0%,#7c3aed_58%,#a78bfa_100%)] px-6 py-7 text-white shadow-[0_35px_80px_-48px_rgba(30,27,75,0.75)] sm:px-8 sm:py-9">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_68%)] lg:block" />

        <div className="relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
              Admin management
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Department administrators
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              View all registered admins, their departments, and manage access across the system.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 shadow-[0_15px_35px_-25px_rgba(30,27,75,0.9)] backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Total admins
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {admins.length}
              </p>
            </div>

            <div className="rounded-[24px] border border-emerald-200/50 bg-emerald-100/15 p-5 shadow-[0_15px_35px_-25px_rgba(30,27,75,0.9)] backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Departments covered
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {Object.keys(departmentStats).length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin list */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_360px]">

        <section className="rounded-[30px] border border-[#dbe7ff] bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-6">
          <div className="border-b border-[#e5edff] pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c3aed]">
              Registered admins
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Admin directory
            </h3>
          </div>

          {admins.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#dbe7ff] bg-[#f8fbff] px-6 text-center mt-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed]">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h4 className="mt-5 text-xl font-semibold text-slate-900">
                No admins registered
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Admins will appear here once they sign up with an admin account.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="mt-6 grid gap-4 md:hidden">
                {admins.map((admin) => (
                  <div key={admin._id} className="rounded-[24px] border border-[#e5edff] bg-[#f8fbff] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7c3aed] text-lg font-bold text-white">
                          {admin.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{admin.name}</p>
                          <p className="text-sm text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-sm font-semibold capitalize text-[#7c3aed]">
                        {admin.department || "Unassigned"}
                      </span>

                      <button
                        onClick={() => handleDelete(admin._id, admin.name)}
                        disabled={deleting === admin._id}
                        className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === admin._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="mt-6 hidden overflow-x-auto md:block">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Admin</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Joined</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin._id} className="rounded-[24px] bg-[#f8fbff] shadow-[0_15px_40px_-35px_rgba(15,23,42,0.7)]">
                        <td className="rounded-l-[24px] border-y border-l border-[#e5edff] px-4 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-bold text-white">
                              {admin.name?.charAt(0)?.toUpperCase() || "A"}
                            </div>
                            <p className="font-semibold text-slate-900">{admin.name}</p>
                          </div>
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-middle text-sm text-slate-600">
                          {admin.email}
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-middle">
                          <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-sm font-semibold capitalize text-[#7c3aed]">
                            {admin.department || "Unassigned"}
                          </span>
                        </td>

                        <td className="border-y border-[#e5edff] px-4 py-4 align-middle text-sm text-slate-500">
                          {new Date(admin.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>

                        <td className="rounded-r-[24px] border-y border-r border-[#e5edff] px-4 py-4 align-middle">
                          <button
                            onClick={() => handleDelete(admin._id, admin.name)}
                            disabled={deleting === admin._id}
                            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {deleting === admin._id ? "Removing..." : "Remove"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Right sidebar */}
        <div className="grid gap-6">

          {/* Department distribution */}
          <section className="rounded-[28px] border border-[#dbe7ff] bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c3aed]">
              Department coverage
            </p>
            <div className="mt-5 space-y-4">
              {Object.entries(departmentStats).sort((a, b) => b[1] - a[1]).map(([dept, count]) => {
                const percentage = admins.length === 0 ? 0 : Math.round((count / admins.length) * 100)
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="capitalize">{dept}</span>
                      <span>{count} admin{count !== 1 ? "s" : ""}</span>
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

          {/* Info card */}
          <section className="rounded-[28px] border border-[#7c3aed] bg-[#7c3aed] p-6 text-white shadow-[0_24px_60px_-45px_rgba(30,27,75,0.7)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">
              Admin note
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {admins.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              department admins are currently active across {Object.keys(departmentStats).length} department{Object.keys(departmentStats).length !== 1 ? "s" : ""}. Removing an admin will revoke their access permanently.
            </p>
          </section>

        </div>
      </div>

    </AdminLayout>

  )

}

export default AdminManagement
