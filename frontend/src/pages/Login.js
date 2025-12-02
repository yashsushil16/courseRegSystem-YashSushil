import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentId: '',
    facultyId: '',
    name: '',
    department: '',
    semester: '',
    designation: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await login(formData.email, formData.password, role);
      if (result.success) {
        navigate(`/${role}`);
      } else {
        setError(result.message);
      }
    } else {
      const registrationData = role === 'student' 
        ? {
            studentId: formData.studentId,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            semester: parseInt(formData.semester),
            phone: formData.phone
          }
        : {
            facultyId: formData.facultyId,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            department: formData.department,
            designation: formData.designation || 'Assistant Professor',
            phone: formData.phone
          };

      const result = await register(registrationData, role);
      if (result.success) {
        navigate(`/${role}`);
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to' : 'Create account at'} YIT University
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                  role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('faculty')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                  role === 'faculty'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Faculty
              </button>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {role === 'student' ? 'Student ID' : 'Faculty ID'}
                  </label>
                  <input
                    name={role === 'student' ? 'studentId' : 'facultyId'}
                    type="text"
                    required={!isLogin}
                    value={formData[role === 'student' ? 'studentId' : 'facultyId']}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={role === 'student' ? 'YIT2024001' : 'FAC2024001'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    required={!isLogin}
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semester</label>
                    <select
                      name="semester"
                      required={!isLogin}
                      value={formData.semester}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                )}
                {role === 'faculty' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <input
                      name="designation"
                      type="text"
                      value={formData.designation}
                      onChange={handleChange}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Assistant Professor"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@yituniversity.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              {isLogin ? 'Sign in' : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

