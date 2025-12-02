import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  BookOpenIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold">YIT University</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {user?.role === 'student' && (
                <>
                  <Link
                    to="/student"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200 transition"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200 transition"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Course Catalog
                  </Link>
                  <Link
                    to="/my-courses"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200 transition"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    My Courses
                  </Link>
                </>
              )}
              {user?.role === 'faculty' && (
                <>
                  <Link
                    to="/faculty"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200 transition"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200 transition"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-2" />
                    Courses
                  </Link>
                </>
              )}
              <Link
                to={user?.role === 'faculty' ? '/faculty-profile' : '/profile'}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-200 transition"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-4">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

