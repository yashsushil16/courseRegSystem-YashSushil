const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// Register for a course
router.post('/register', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can register for courses' });
    }

    const { courseId } = req.body;
    const student = await Student.findById(req.user.id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: req.user.id,
      course: courseId,
      status: 'registered'
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    // Check for slot conflicts
    const studentRegistrations = await Registration.find({
      student: req.user.id,
      status: 'registered'
    });
    
    // Populate courses for slot check
    const slotConflict = (await Promise.all(studentRegistrations.map(async (reg) => {
      const regCourse = await Course.findById(reg.course);
      return regCourse;
    }))).some(regCourse => {
      return regCourse && regCourse.slot === course.slot && regCourse.semester === course.semester;
    });

    if (slotConflict) {
      return res.status(400).json({ message: 'Slot conflict: You already have a course in this slot' });
    }

    // Create registration - ensure student ID is stored as string
    const registration = new Registration({
      student: String(req.user.id),
      course: String(courseId),
      semester: course.semester,
      registrationDate: new Date().toISOString(),
      status: 'registered'
    });

    await registration.save();

    // Update course seats
    course.availableSeats -= 1;
    await course.save();

    // Update student's registered courses
    if (student) {
      if (!student.registeredCourses) student.registeredCourses = [];
      if (!student.registeredCourses.includes(courseId)) {
        student.registeredCourses.push(courseId);
        await student.save();
      }
    }

    // Populate registration data for response
    const courseData = await Course.findById(courseId);
    const responseData = {
      _id: registration._id,
      student: student ? {
        _id: student._id,
        name: student.name,
        studentId: student.studentId
      } : null,
      course: courseData ? {
        _id: courseData._id,
        courseCode: courseData.courseCode,
        courseName: courseData.courseName,
        department: courseData.department,
        credits: courseData.credits,
        semester: courseData.semester,
        faculty: courseData.faculty,
        facultyName: courseData.facultyName,
        totalSeats: courseData.totalSeats,
        availableSeats: courseData.availableSeats,
        slot: courseData.slot,
        schedule: courseData.schedule,
        description: courseData.description
      } : null,
      semester: registration.semester,
      registrationDate: registration.registrationDate || registration.createdAt || new Date().toISOString(),
      status: registration.status,
      createdAt: registration.createdAt,
      updatedAt: registration.updatedAt
    };

    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Drop a course
router.post('/drop', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can drop courses' });
    }

    const { courseId } = req.body;
    const registration = await Registration.findOne({
      student: req.user.id,
      course: courseId,
      status: 'registered'
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = 'dropped';
    await registration.save();

    // Update course seats
    const course = await Course.findById(courseId);
    if (course) {
      course.availableSeats += 1;
      await course.save();
    }

    // Update student's registered courses
    const student = await Student.findById(req.user.id);
    if (student && student.registeredCourses) {
      student.registeredCourses = student.registeredCourses.filter(id => id !== courseId);
      await student.save();
    }

    res.json({ message: 'Course dropped successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's registrations
router.get('/my-courses', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get registrations for this student
    const allRegistrations = await Registration.find({});
    const studentId = String(req.user.id);
    const registrations = allRegistrations.filter(reg => 
      String(reg.student) === studentId && reg.status === 'registered'
    );
    
    // Get course details for each registration
    const populatedRegistrations = await Promise.all(registrations.map(async (reg) => {
      const course = await Course.findById(reg.course);
      const student = await Student.findById(reg.student);
      
      if (!course) return null;
      
      return {
        _id: reg._id,
        student: student ? {
          _id: student._id,
          name: student.name,
          studentId: student.studentId
        } : reg.student,
        course: {
          _id: course._id,
          courseCode: course.courseCode,
          courseName: course.courseName,
          department: course.department,
          credits: course.credits,
          semester: course.semester,
          faculty: course.faculty,
          facultyName: course.facultyName,
          totalSeats: course.totalSeats,
          availableSeats: course.availableSeats,
          slot: course.slot,
          schedule: course.schedule,
          description: course.description
        },
        semester: reg.semester,
        registrationDate: reg.registrationDate || reg.createdAt,
        status: reg.status || 'registered',
        createdAt: reg.createdAt,
        updatedAt: reg.updatedAt
      };
    }));

    // Remove any null entries
    const validRegistrations = populatedRegistrations.filter(reg => reg !== null);
    res.json(validRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all registrations (Admin/Faculty)
router.get('/all', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ status: 'registered' });
    
    // Populate course and student data
    const populatedRegistrations = await Promise.all(registrations.map(async (reg) => {
      const course = await Course.findById(reg.course);
      const student = await Student.findById(reg.student);
      return {
        ...reg,
        course: course || reg.course,
        student: student ? {
          name: student.name,
          studentId: student.studentId,
          email: student.email
        } : reg.student
      };
    }));

    res.json(populatedRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

