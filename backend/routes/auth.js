const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// Register Student
router.post('/register/student', async (req, res) => {
  try {
    const { studentId, name, email, password, department, semester, phone } = req.body;

    const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      studentId,
      name,
      email,
      password: hashedPassword,
      department,
      semester,
      phone
    });

    await student.save();

    const token = jwt.sign(
      { id: student._id, role: 'student', studentId: student.studentId },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register Faculty
router.post('/register/faculty', async (req, res) => {
  try {
    const { facultyId, name, email, password, department, designation, phone } = req.body;

    const existingFaculty = await Faculty.findOne({ $or: [{ email }, { facultyId }] });
    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = new Faculty({
      facultyId,
      name,
      email,
      password: hashedPassword,
      department,
      designation,
      phone
    });

    await faculty.save();

    const token = jwt.sign(
      { id: faculty._id, role: 'faculty', facultyId: faculty.facultyId },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: faculty._id,
        facultyId: faculty.facultyId,
        name: faculty.name,
        email: faculty.email,
        role: 'faculty'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === 'student') {
      user = await Student.findOne({ email });
    } else if (role === 'faculty') {
      user = await Faculty.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role,
        ...(role === 'student' ? { studentId: user.studentId } : { facultyId: user.facultyId })
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        ...(role === 'student' ? { studentId: user.studentId } : { facultyId: user.facultyId }),
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

