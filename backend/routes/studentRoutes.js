const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all students (Admin only)
// @route   GET /api/students
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a student (Admin only)
// @route   POST /api/students
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    const { name, email, password, course } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const student = await User.create({
            name,
            email,
            password: password || 'password123', // Default password for admin-created users
            role: 'student',
            course,
        });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update student (Admin or Student themselves)
// @route   PUT /api/students/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check permissions: Admin can update anyone, Student can only update themselves
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        student.name = req.body.name || student.name;
        student.email = req.body.email || student.email;
        student.course = req.body.course || student.course;

        // Only hash password if it's sent in the body
        if (req.body.password) {
            student.password = req.body.password;
        }

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete student (Admin only)
// @route   DELETE /api/students/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'Student removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
