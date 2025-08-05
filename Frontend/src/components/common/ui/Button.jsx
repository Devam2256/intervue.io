// Button: Reusable button component with different styles and sizes
export function Button({
  children,        // Content inside the button
  variant = "primary",  // Button style (primary, secondary, outline, etc.)
  size = "md",     // Button size (xs, sm, md, lg, xl, icon)
  disabled = false, // Whether button is disabled
  onClick,         // Function to run when button is clicked
  type = "button", // HTML button type (button, submit, reset)
  className = "",  // Additional CSS classes
  fullWidth = false, // Whether button should take full width
  ...props         // Any other props to pass to the button
}) {
  // Base CSS classes that apply to all buttons
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"

  // Different button styles (variants)
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white border-0",
    secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border-0",
    outline: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-0",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-0",
    danger: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white border-0",
    success: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white border-0",
    sleek: "bg-transparent hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-400 dark:text-gray-300 border-0 ring-1 ring-gray-700/10 dark:ring-white/10 hover:ring-blue-400 hover:text-blue-500 dark:hover:text-blue-300",
  }

  // Different button sizes
  const sizes = {
    xs: "px-2 py-1 text-xs",      // Extra small
    sm: "px-2.5 py-1.5 text-sm",  // Small
    md: "px-3 py-2 text-sm",      // Medium (default)
    lg: "px-5 py-3 text-base",    // Large
    xl: "px-7 py-4 text-lg",      // Extra large
    icon: "p-2",                  // Square button for icons
  }

  // Width class - full width if specified
  const widthClasses = fullWidth ? "w-full" : ""

  // Combine all CSS classes
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClasses} ${className}`

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  )
}