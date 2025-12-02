import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

const CourseCatalog = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    semester: '',
    department: '',
    slot: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courses, searchTerm, filters]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.semester) {
      filtered = filtered.filter(course => course.semester === parseInt(filters.semester));
    }

    if (filters.department) {
      filtered = filtered.filter(course => course.department === filters.department);
    }

    if (filters.slot) {
      filtered = filtered.filter(course => course.slot === filters.slot);
    }

    setFilteredCourses(filtered);
  };

  const handleRegister = async (courseId) => {
    try {
      await axios.post('http://localhost:5000/api/registrations/register', { courseId });
      alert('Course registered successfully!');
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to register for course');
    }
  };

  const handleDrop = async (courseId) => {
    if (window.confirm('Are you sure you want to drop this course?')) {
      try {
        await axios.post('http://localhost:5000/api/registrations/drop', { courseId });
        alert('Course dropped successfully!');
        fetchCourses();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Catalog</h1>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or faculty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot</label>
                  <select
                    value={filters.slot}
                    onChange={(e) => setFilters({ ...filters, slot: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Slots</option>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(slot => (
                      <option key={slot} value={slot}>Slot {slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseName}</h3>
                    <p className="text-sm text-gray-600">{course.courseCode}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    course.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {course.availableSeats} seats
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span> {course.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Semester:</span> {course.semester}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Credits:</span> {course.credits}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Faculty:</span> {course.facultyName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Slot:</span> {course.slot}
                  </p>
                  {course.schedule && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Schedule:</span> {course.schedule.days?.join(', ')} {course.schedule.time}
                    </p>
                  )}
                </div>

                {course.description && (
                  <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                )}

                {user?.role === 'student' && (
                  <div className="mt-4">
                    {course.availableSeats > 0 ? (
                      <button
                        onClick={() => handleRegister(course._id)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Register
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                      >
                        Full
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;

