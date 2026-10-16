import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 10 + 6,
  duration: Math.random() * 18 + 12,
  delay: Math.random() * 8,
}))

function Signup() {

  const navigate = useNavigate()
  const { user, loading: authLoading, login } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (authLoading) {
      return
    }

    if (!user) {
      return
    }

    if (user.role === "superadmin") {
      navigate("/superadmin")
    } else if (user.role === "admin") {
      navigate("/admin")
    } else {
      navigate("/student")
    }

  }, [user, authLoading, navigate])

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: ""
  })

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {

      const bodyData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      }

      // only send department if admin
      if (form.role === "admin") {
        bodyData.department = form.department
      }

      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(bodyData)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message)
        setLoading(false)
        return
      }

      login(data.user)

      if (data.user.role === "superadmin") {
        navigate("/superadmin")
      } else if (data.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/student")
      }

    } catch (error) {

      console.log(error)
      alert("Signup failed")

    } finally {
      setLoading(false)

    }

  }

  return (

    <div style={{ fontFamily: "'Manrope', sans-serif", minHeight: "100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes rise {
          0% {
            transform: translate3d(0, 24px, 0) scale(0.95);
            opacity: 0;
          }
          20% {
            opacity: 0.35;
          }
          100% {
            transform: translate3d(0, -110vh, 0) scale(1.05);
            opacity: 0;
          }
        }

        @keyframes reveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .signup-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          background: radial-gradient(circle at 12% 12%, #f5efe5 0%, #e6ecf8 45%, #d9e4f2 100%);
        }

        .brand-panel {
          position: relative;
          overflow: hidden;
          padding: 72px 64px;
          background:
            radial-gradient(circle at 20% 22%, rgba(255, 244, 212, 0.5) 0%, rgba(255, 244, 212, 0) 46%),
            radial-gradient(circle at 85% 80%, rgba(124, 115, 168, 0.2) 0%, rgba(124, 115, 168, 0) 42%),
            linear-gradient(150deg, #0f172a 0%, #1f2b4d 46%, #263357 100%);
          color: #edf2ff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .particle {
          position: absolute;
          border-radius: 999px;
          filter: blur(0.5px);
          background: linear-gradient(180deg, rgba(255, 247, 228, 0.35), rgba(145, 171, 255, 0.3));
          animation: rise linear infinite;
        }

        .brand-text {
          position: relative;
          z-index: 2;
          max-width: 540px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(237, 242, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #c7d2fe;
        }

        .brand-title {
          font-family: "Fraunces", serif;
          font-size: clamp(2rem, 3.9vw, 3.35rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 14px;
          color: #f8fafc;
        }

        .brand-subtitle {
          color: rgba(226, 232, 240, 0.82);
          font-size: 1rem;
          line-height: 1.7;
          max-width: 470px;
        }

        .metric-grid {
          position: relative;
          z-index: 2;
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          max-width: 580px;
        }

        .metric-card {
          border-radius: 16px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.14);
          backdrop-filter: blur(4px);
        }

        .metric-card strong {
          display: block;
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .metric-card span {
          color: #cbd5e1;
          font-size: 0.78rem;
          font-weight: 600;
        }

        .form-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
        }

        .form-panel::before {
          content: "";
          position: absolute;
          inset: 36px;
          border-radius: 26px;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.18));
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 28px 60px rgba(15, 23, 42, 0.2);
          backdrop-filter: blur(8px);
        }

        .form-card {
          position: relative;
          z-index: 2;
          width: min(100%, 440px);
          padding: 22px 6px;
          animation: reveal 0.65s ease both;
        }

        .form-title {
          color: #0f172a;
          font-size: clamp(1.6rem, 2.2vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .form-copy {
          color: #475569;
          margin-top: 8px;
          margin-bottom: 22px;
          font-size: 0.95rem;
        }

        .input-wrap {
          margin-bottom: 12px;
        }

        .input-label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          letter-spacing: 0.02em;
        }

        .input-field {
          width: 100%;
          padding: 13px 14px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: rgba(255, 255, 255, 0.78);
          color: #0f172a;
          outline: none;
          font-size: 0.96rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input-field::placeholder {
          color: #94a3b8;
        }

        .input-field:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.14);
        }

        .signup-btn {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(145deg, #111827, #374151);
          color: #f8fafc;
          font-weight: 800;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 14px 22px rgba(17, 24, 39, 0.24);
        }

        .signup-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 26px rgba(17, 24, 39, 0.28);
        }

        .signup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .signin {
          margin-top: 16px;
          text-align: center;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .signin a {
          color: #b45309;
          text-decoration: none;
          font-weight: 800;
        }

        .signin a:hover {
          text-decoration: underline;
        }

        @media (max-width: 980px) {
          .signup-shell {
            grid-template-columns: 1fr;
          }

          .brand-panel {
            min-height: 46vh;
            padding: 48px 28px;
          }

          .metric-grid {
            max-width: none;
          }

          .form-panel {
            margin-top: -42px;
            padding: 0 18px 24px;
          }

          .form-panel::before {
            inset: 0;
          }

          .form-card {
            padding: 32px 20px;
          }
        }

        @media (max-width: 640px) {
          .brand-panel {
            min-height: 52vh;
          }

          .metric-grid {
            grid-template-columns: 1fr;
          }

          .form-card {
            width: 100%;
            padding: 28px 16px;
          }
        }
      `}</style>

      <div className="signup-shell">

        <section className="brand-panel">

          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                bottom: `-${p.size * 1.8}px`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}

          <div className="brand-text">
            <span className="eyebrow">Campus Complaint Desk</span>
            <h1 className="brand-title">Start Building Better Campus Feedback.</h1>
            <p className="brand-subtitle">
              Create your account to submit issues, track responses, and help every department resolve problems faster.
            </p>

            <div className="metric-grid">
              <div className="metric-card">
                <strong>Easy onboarding</strong>
                <span>Quick setup for students</span>
              </div>
              <div className="metric-card">
                <strong>Department mapping</strong>
                <span>Smart admin assignment</span>
              </div>
              <div className="metric-card">
                <strong>Secure access</strong>
                <span>Role-based visibility</span>
              </div>
            </div>
          </div>

        </section>

        <section className="form-panel">

          <div className="form-card">

            <h2 className="form-title">Create your account</h2>
            <p className="form-copy">Use your details to join the complaint tracker platform.</p>

            <form onSubmit={handleSubmit}>

              <div className="input-wrap">
                <label className="input-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="input-field"
                  onChange={handleChange}
                  value={form.name}
                  required
                />
              </div>

              <div className="input-wrap">
                <label className="input-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@college.edu"
                  className="input-field"
                  onChange={handleChange}
                  value={form.email}
                  required
                />
              </div>

              <div className="input-wrap">
                <label className="input-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Choose a strong password"
                  className="input-field"
                  onChange={handleChange}
                  value={form.password}
                  required
                />
              </div>

              <div className="input-wrap">
                <label className="input-label" htmlFor="role">Account Type</label>
                <select
                  id="role"
                  name="role"
                  className="input-field"
                  onChange={handleChange}
                  value={form.role}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {form.role === "admin" && (
                <div className="input-wrap">
                  <label className="input-label" htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    className="input-field"
                    onChange={handleChange}
                    value={form.department}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="maintenance">Maintenance Department</option>
                    <option value="hostel">Hostel Warden</option>
                    <option value="academic">Academic Office</option>
                    <option value="canteen">Canteen Manager</option>
                    <option value="student welfare">Student Welfare Cell</option>
                    <option value="administration">Administration</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="signin">
                Already registered?
                <Link to="/"> Sign in</Link>
              </p>

            </form>

          </div>

        </section>

      </div>

    </div>

  )

}

export default Signup