import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

export function DashboardHeader({
  title,
  subtitle,
  searchTerm,
  onSearchChange,
  onCreateClick,
  createButtonText = "Create",
  showCreateButton = true,
  showSearch = true,
  children
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          
          {showCreateButton && (
            <div className="flex-shrink-0">
              <Button
                onClick={onCreateClick}
                variant="primary"
                size="md"
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createButtonText}
              </Button>
            </div>
          )}
        </div>

        {/* Search and filters section */}
        {(showSearch || children) && (
          <div className="flex flex-col sm:flex-row gap-4">
            {showSearch && (
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
              </div>
            )}
            
            {children && (
              <div className="flex items-center space-x-4">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterButton({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}