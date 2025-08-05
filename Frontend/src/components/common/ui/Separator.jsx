// Separator: Simple horizontal line for separating content
export function Separator({ className = "", orientation = "horizontal" }) {
  const orientationClasses = orientation === "horizontal" ? "w-full h-px" : "h-full w-px"

  return <div className={`bg-gray-200 dark:bg-gray-700 ${orientationClasses} ${className}`} />
}