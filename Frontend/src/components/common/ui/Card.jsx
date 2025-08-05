// Card: Simple card container for grouping content with different styles
export function Card({ 
  children,         // Content inside the card
  className = "",   // Additional CSS classes
  onClick,          // Function to run when card is clicked
  hover = false,    // Whether to show hover effects
  noBorder = false, // Whether to hide the border
  ...props          // Any other props to pass to the div
}) {
  // Base CSS classes for the card
  const baseClasses = `${noBorder ? '' : 'border border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg`
  
  // Add cursor pointer if card is clickable
  const clickableClasses = onClick ? 'cursor-pointer' : ''
  
  // Add hover effects if enabled
  const hoverClasses = hover ? "hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200" : ""

  // Remove 'hover' from props so it doesn't get passed to the DOM element
  const { hover: _hover, ...rest } = props

  return (
    <div 
      className={`${baseClasses} ${clickableClasses} ${hoverClasses} ${className}`} 
      onClick={onClick} 
      {...rest}
    >
      {children}
    </div>
  )
}

// Card header section - for titles and actions
export function CardHeader({ 
  children,         // Content inside the header
  className = ""    // Additional CSS classes
}) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}

// Card content section - for main content
export function CardContent({ 
  children,         // Content inside the card body
  className = ""    // Additional CSS classes
}) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

// Card title - for card headings
export function CardTitle({ 
  children,         // Title text
  className = ""    // Additional CSS classes
}) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  )
}