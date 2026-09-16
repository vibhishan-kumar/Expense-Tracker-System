const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validateRegistration } = require('../middleware/validationMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

// 1. User Registration (with regex validation middleware)
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { name, registration_number, email, password, course, student_type, hostel_name, semester, phone_number } = req.body;

        // Check if email already in use
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ error: 'Email already in use' });

        // Check if registration number already in use
        const existingReg = await User.findOne({ where: { registration_number } });
        if (existingReg) return res.status(400).json({ error: 'Registration number is already registered' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user with default role 'user'
        const newUser = await User.create({
            name,
            registration_number,
            email,
            password_hash,
            role: 'user',
            course,
            student_type,
            hostel_name: student_type === 'hosteller' ? hostel_name : null,
            semester,
            phone_number: phone_number || null,
            is_active: true
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser.id,
            role: newUser.role
        });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors?.[0]?.path;
            const message = field === 'registration_number'
                ? 'Registration number is already registered'
                : field === 'email'
                ? 'Email already in use'
                : 'A user with these credentials already exists';
            return res.status(400).json({ error: message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check active status
        if (!user.is_active) {
            return res.status(403).json({ error: 'Account has been deactivated. Please contact an administrator.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const userRole = user.role || 'user';

        // Generate JWT with user role
        const token = jwt.sign(
            { id: user.id, email: user.email, role: userRole },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: userRole,
                student_type: user.student_type,
                registration_number: user.registration_number
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
