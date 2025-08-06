import { Card } from "./Card";

export function StatsCard({ title, value, icon: Icon, color = "blue", loading = false, onClick, clickable = false }) {
  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
  };

  return (
    <Card hover>
      <div 
        className={`p-6 ${clickable ? 'cursor-pointer' : ''}`}
        onClick={clickable ? onClick : undefined}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function StatsGrid({ children, className = "" }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {children}
    </div>
  );
}