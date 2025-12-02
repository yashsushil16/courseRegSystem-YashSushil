const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const auth = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { semester, department, search, slot } = req.query;
    let query = {};

    if (semester) query.semester = parseInt(semester);
    if (department) query.department = department;
    if (slot) query.slot = slot;
    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { facultyName: { $regex: search, $options: 'i' } }
      ];
    }

    let courses = await Course.find(query);
    // Populate faculty data
    for (let course of courses) {
      if (course.faculty) {
        const faculty = await Faculty.findById(course.faculty);
        if (faculty) {
          course.faculty = {
            name: faculty.name,
            email: faculty.email,
            department: faculty.department
          };
        }
      }
    }
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // Populate faculty
    if (course.faculty) {
      const faculty = await Faculty.findById(course.faculty);
      if (faculty) {
        course.faculty = {
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          designation: faculty.designation
        };
      }
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course (Faculty only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Only faculty can create courses' });
    }

    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const course = new Course({
      ...req.body,
      faculty: req.user.id,
      facultyName: faculty.name
    });

    await course.save();
    // Update faculty courses array
    if (faculty) {
      if (!faculty.courses) faculty.courses = [];
      if (!faculty.courses.includes(course._id)) {
        faculty.courses.push(course._id);
        await faculty.save();
      }
    }

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'faculty' && course.faculty !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'faculty' && course.faculty !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    const CourseStore = require('../dataStore').Course;
    await CourseStore.delete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

