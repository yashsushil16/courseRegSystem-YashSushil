import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import CourseCatalog from './pages/CourseCatalog';
import MyCourses from './pages/MyCourses';
import Profile from './pages/Profile';
import FacultyProfile from './pages/FacultyProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <PrivateRoute role="faculty">
                <FacultyDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <CourseCatalog />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-courses"
            element={
              <PrivateRoute role="student">
                <MyCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/faculty-profile"
            element={
              <PrivateRoute role="faculty">
                <FacultyProfile />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

