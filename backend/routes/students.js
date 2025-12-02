const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Registration = require('../models/Registration');
const auth = require('../middleware/auth');

// Get all students (Admin/Faculty)
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find();
    // Remove passwords from response
    const studentsWithoutPassword = students.map(s => {
      const { password, ...rest } = s;
      return rest;
    });
    res.json(studentsWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { password, ...studentWithoutPassword } = student;
    res.json(studentWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const { password, ...studentWithoutPassword } = student;
    res.json(studentWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    Object.assign(student, req.body);
    await student.save();

    res.json({ ...student.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's registered courses
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.params.id,
      status: 'registered'
    });
    
    // Populate course and student data
    const Course = require('../models/Course');
    const populatedRegistrations = await Promise.all(registrations.map(async (reg) => {
      const course = await Course.findById(reg.course);
      const student = await Student.findById(reg.student);
      return {
        ...reg,
        course: course || reg.course,
        student: student ? {
          name: student.name,
          studentId: student.studentId
        } : reg.student
      };
    }));

    res.json(populatedRegistrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

