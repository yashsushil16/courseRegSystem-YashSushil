const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all faculty
router.get('/', auth, async (req, res) => {
  try {
    const faculty = await Faculty.find();
    // Remove passwords from response
    const facultyWithoutPassword = faculty.map(f => {
      const { password, ...rest } = f;
      return rest;
    });
    res.json(facultyWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get faculty profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const { password, ...facultyWithoutPassword } = faculty;
    res.json(facultyWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get faculty by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    const { password, ...facultyWithoutPassword } = faculty;
    res.json(facultyWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get faculty's courses
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.params.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update faculty profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    Object.assign(faculty, req.body);
    await faculty.save();

    res.json({ ...faculty.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

