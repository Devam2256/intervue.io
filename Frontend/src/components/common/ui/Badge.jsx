// Badge: Small badge for status or counts
export function Badge({ children, variant = "default", className = "" }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium max-w-full truncate"

  const variants = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    outline: "border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300",
  }

  return <span className={`${baseClasses} ${variants[variant]} ${className}`}>{children}</span>
}