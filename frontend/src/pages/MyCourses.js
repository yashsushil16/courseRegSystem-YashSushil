import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const MyCourses = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/registrations/my-courses');
      // Filter out any invalid registrations and ensure course data exists
      const validRegistrations = response.data.filter(reg => 
        reg && reg.course && typeof reg.course === 'object' && reg.course.courseName
      );
      setRegistrations(validRegistrations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleDrop = async (courseId) => {
    if (window.confirm('Are you sure you want to drop this course?')) {
      try {
        await axios.post('http://localhost:5000/api/registrations/drop', { courseId });
        alert('Course dropped successfully!');
        fetchMyCourses();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to drop course');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Registered Courses</h1>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
              Total: {registrations.length} courses
            </div>
          </div>

          {registrations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">You haven't registered for any courses yet.</p>
              <a
                href="/courses"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Browse Course Catalog →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map(reg => {
                // Safety check for course data
                if (!reg.course || typeof reg.course !== 'object') {
                  console.error('Invalid course data:', reg);
                  return null;
                }
                return (
                <div key={reg._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{reg.course.courseName || 'Unknown Course'}</h3>
                      <p className="text-sm text-gray-600">{reg.course.courseCode || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => handleDrop(reg.course._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Drop Course"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Department:</span> {reg.course.department}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Semester:</span> {reg.course.semester}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Credits:</span> {reg.course.credits}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Faculty:</span> {reg.course.facultyName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Slot:</span> {reg.course.slot}
                    </p>
                    {reg.course.schedule && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Schedule:</span> {reg.course.schedule.days?.join(', ')} {reg.course.schedule.time}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Registered:</span> {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-semibold">{reg.status || 'registered'}</span>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;

