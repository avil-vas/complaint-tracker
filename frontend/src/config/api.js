const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const API_URL = (configuredApiUrl || "https://complaint-tracker-backend-oqe4.onrender.com").replace(/\/$/, "")

export const apiUrl = (path) => `${API_URL}${path.startsWith("/") ? path : `/${path}`}`
