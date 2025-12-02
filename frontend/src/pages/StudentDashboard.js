import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ClockIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/courses"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
            >
              <div className="flex items-center">
                <BookOpenIcon className="h-12 w-12 text-blue-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Course Catalog</h3>
                  <p className="text-sm text-gray-600">Browse and search available courses</p>
                </div>
              </div>
            </Link>

            <Link
              to="/my-courses"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-green-500"
            >
              <div className="flex items-center">
                <AcademicCapIcon className="h-12 w-12 text-green-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Courses</h3>
                  <p className="text-sm text-gray-600">View your registered courses</p>
                </div>
              </div>
            </Link>

            <Link
              to="/profile"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-purple-500"
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-12 w-12 text-purple-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                  <p className="text-sm text-gray-600">View and update your profile</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                • Browse courses by semester, department, or slot
              </p>
              <p className="text-gray-600">
                • Check seat availability before registering
              </p>
              <p className="text-gray-600">
                • View faculty information for each course
              </p>
              <p className="text-gray-600">
                • Register or drop courses from your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

