// Input: Reusable form input components (text input, textarea, select dropdown, and labels)
import Dropdown from "./Dropdown";

// Text input component for single-line text
export function Input({
  type = "text",     // Input type (text, email, password, etc.)
  placeholder,       // Placeholder text shown when input is empty
  value,            // Current value of the input
  onChange,         // Function called when input value changes
  className = "",   // Additional CSS classes
  disabled = false, // Whether input is disabled
  required = false, // Whether input is required
  id,               // HTML id attribute
  ...props          // Any other props to pass to the input
}) {
  // Base CSS classes for all text inputs
  const baseClasses =
    "w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  )
}

// Textarea component for multi-line text
export function Textarea({
  placeholder,       // Placeholder text shown when textarea is empty
  value,            // Current value of the textarea
  onChange,         // Function called when textarea value changes
  rows = 3,         // Number of visible rows
  className = "",   // Additional CSS classes
  disabled = false, // Whether textarea is disabled
  required = false, // Whether textarea is required
  id,               // HTML id attribute
  ...props          // Any other props to pass to the textarea
}) {
  // Base CSS classes for textareas
  const baseClasses =
    "w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical text-base sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"

  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  )
}

// Select dropdown component (uses the Dropdown component)
export function Select({ 
  value,            // Currently selected value
  onValueChange,    // Function called when selection changes
  placeholder,      // Placeholder text shown when nothing is selected
  options,          // Array of options to choose from
  className = "",   // Additional CSS classes
  disabled = false  // Whether select is disabled
}) {
  return (
    <Dropdown
      value={value}
      onChange={onValueChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
}

// Label component for form fields
export function Label({ 
  children,         // Label text
  htmlFor,          // ID of the input this label is for
  className = "",   // Additional CSS classes
  required = false  // Whether to show a red asterisk for required fields
}) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${className}`}
    >
      {children}
      {/* Show red asterisk for required fields */}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}