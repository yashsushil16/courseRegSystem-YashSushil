import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { BookOpenIcon, UserGroupIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const FacultyDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Faculty Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/courses"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
            >
              <div className="flex items-center">
                <BookOpenIcon className="h-12 w-12 text-blue-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">All Courses</h3>
                  <p className="text-sm text-gray-600">View all available courses</p>
                </div>
              </div>
            </Link>

            <Link
              to="/faculty-profile"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Faculty Features</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                • Create and manage your courses
              </p>
              <p className="text-gray-600">
                • Set course schedules and slots
              </p>
              <p className="text-gray-600">
                • View registered students for your courses
              </p>
              <p className="text-gray-600">
                • Update course information and seat availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

