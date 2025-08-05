// Dropdown: Custom dropdown menu with animation and no scrollbars
import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({
  options = [],
  value = "",
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  dropdownClassName = "",
  optionClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && value) {
      const idx = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx);
    }
  }, [open, value, options]);

  function handleSelect(option) {
    if (!disabled) {
      onChange && onChange(option.value);
      setOpen(false);
    }
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        setOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % options.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
      e.preventDefault();
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelect(options[highlightedIndex]);
      e.preventDefault();
    }
  }

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`relative w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
    >
      <button
        type="button"
        className={`w-full px-3 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedOption ? "" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul
          className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-out opacity-100 translate-y-0 animate-dropdown-fade-slide scrollbar-none ${dropdownClassName}`}
          role="listbox"
        >
          {options.length === 0 && (
            <li className="px-4 py-2 text-gray-400">No options</li>
          )}
          {options.map((option, idx) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={`px-4 py-2 cursor-pointer select-none transition-colors duration-150 ${value === option.value ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200" : "hover:bg-gray-100 dark:hover:bg-gray-600"} ${highlightedIndex === idx ? "bg-blue-50 dark:bg-blue-800" : ""} ${optionClassName}`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 