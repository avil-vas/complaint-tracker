const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const fallbackApiUrl = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://complaint-tracker-backend-oqe4.onrender.com"

export const API_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/$/, "")

export const apiUrl = (path) => `${API_URL}${path.startsWith("/") ? path : `/${path}`}`
