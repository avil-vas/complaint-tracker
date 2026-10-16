export const statusOptions = ["Pending", "In Progress", "Resolved"]

export function getStatusClasses(status) {

  if (status === "Resolved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (status === "In Progress") {
    return "border-sky-200 bg-sky-50 text-sky-700"
  }

  if (status === "Pending") {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }

  return "border-stone-200 bg-stone-100 text-stone-700"

}

export function normalisePriority(priority = "") {

  const value = priority.toLowerCase()

  if (value.includes("high")) {
    return "High"
  }

  if (value.includes("medium")) {
    return "Medium"
  }

  if (value.includes("low")) {
    return "Low"
  }

  return priority || "Unassigned"

}

export function getPriorityClasses(priority = "") {

  const value = normalisePriority(priority)

  if (value === "High") {
    return "border-rose-200 bg-rose-50 text-rose-700"
  }

  if (value === "Medium") {
    return "border-orange-200 bg-orange-50 text-orange-700"
  }

  if (value === "Low") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  return "border-stone-200 bg-stone-100 text-stone-700"

}