import { useState, useEffect } from 'react';
import { X, Calendar, Building, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function ApplicationHistoryModal({ isOpen, onClose, applications, title, user }) {
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    if (applications && title) {
      let filtered = [];
      
      switch (title) {
        case 'Total Applications':
          filtered = applications;
          break;
        case 'Accepted':
          filtered = applications.filter(app => app.status === 'Accepted');
          break;
        case 'In Progress':
          filtered = applications.filter(app => ['Applied', 'Reviewing', 'Interview', 'Scheduled'].includes(app.status));
          break;
        case 'Rejected':
          filtered = applications.filter(app => app.status === 'Rejected');
          break;
        default:
          filtered = applications;
      }
      
      setFilteredApplications(filtered);
    }
  }, [applications, title]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Scheduled':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {filteredApplications.length > 0 ? (
            <div className="p-6 space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {application.job_id?.title || 'Position Not Available'}
                        </h3>
                        {getStatusIcon(application.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{application.company_id?.name || 'Company Not Available'}</span>
                        </div>
                        {application.job_id?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{application.job_id.location}</span>
                          </div>
                        )}
                        {application.job_id?.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{application.job_id.salary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Application Details</h4>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                        {application.expectedSalary && (
                          <p><strong>Expected Salary:</strong> {application.expectedSalary}</p>
                        )}
                        {application.availability && (
                          <p><strong>Availability:</strong> {application.availability}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Job Details</h4>
                      <div className="space-y-1 text-gray-600 dark:text-gray-400">
                        <p><strong>Category:</strong> {application.job_id?.category || 'Not specified'}</p>
                        <p><strong>Type:</strong> {application.job_id?.type || 'Not specified'}</p>
                        {application.job_id?.description && (
                          <p className="line-clamp-2">
                            <strong>Description:</strong> {application.job_id.description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {application.status === 'Scheduled' && application.interviewSchedule && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Interview Scheduled
                      </h4>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p><strong>Date:</strong> {new Date(application.interviewSchedule.scheduledAt).toLocaleDateString()}</p>
                        <p><strong>Location:</strong> {application.interviewSchedule.location}</p>
                        {application.interviewSchedule.notes && (
                          <p><strong>Notes:</strong> {application.interviewSchedule.notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No applications found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {title === 'Total Applications' 
                  ? "You haven't applied to any jobs yet."
                  : `You don't have any ${title.toLowerCase()} applications.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 