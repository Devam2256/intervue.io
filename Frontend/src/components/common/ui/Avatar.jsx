// Avatar: User/company avatar image or placeholder
export function Avatar({ children, className = "", size = "md" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  return <div className={`${sizes[size]} rounded-full overflow-hidden ${className}`}>{children}</div>
}

export function AvatarFallback({ children, className = "" }) {
  return (
    <div
      className={`w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold ${className}`}
    >
      {children}
    </div>
  )
}