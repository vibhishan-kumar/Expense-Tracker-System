const express = require('express');
const { User, Transaction, Category, Budget } = require('../models');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Enforce admin-only access on all routes in this file
router.use(authorizeRoles('admin'));

// 1. GET /api/admin/stats — System-wide analytics overview
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.count({ where: { role: 'user' } });
        const activeUsers = await User.count({ where: { role: 'user', is_active: true } });
        const totalTransactions = await Transaction.count({ where: { deleted_at: null } });

        const [txTotals] = await sequelize.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
                COALESCE(SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END), 0) AS total_income
            FROM Transactions
            WHERE deleted_at IS NULL
        `, { type: QueryTypes.SELECT });

        const totalBudgets = await Budget.count({ where: { deleted_at: null } });
        const totalCategories = await Category.count({ where: { deleted_at: null } });

        res.json({
            users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
            transactions: {
                count: totalTransactions,
                totalExpenses: parseFloat(txTotals?.total_expenses || 0),
                totalIncome: parseFloat(txTotals?.total_income || 0)
            },
            budgets: totalBudgets,
            categories: totalCategories
        });
    } catch (err) {
        console.error('Admin Stats Error:', err);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

// 2. GET /api/admin/users — List all students with financial summary
router.get('/users', async (req, res) => {
    try {
        const users = await sequelize.query(`
            SELECT 
                u.id, 
                u.name, 
                u.registration_number, 
                u.email, 
                u.role, 
                u.course, 
                u.student_type, 
                u.hostel_name, 
                u.semester, 
                u.is_active,
                COUNT(t.id) AS transaction_count,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_spent
            FROM Users u
            LEFT JOIN Transactions t ON u.id = t.user_id AND t.deleted_at IS NULL
            GROUP BY u.id, u.name, u.registration_number, u.email, u.role, u.course, u.student_type, u.hostel_name, u.semester, u.is_active
            ORDER BY u.id DESC
        `, { type: QueryTypes.SELECT });

        res.json(users);
    } catch (err) {
        console.error('Admin Users Error:', err);
        res.status(500).json({ error: 'Failed to fetch user list' });
    }
});

// 3. PATCH /api/admin/users/:id/status — Toggle user active/inactive status
router.patch('/users/:id/status', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ error: 'Cannot deactivate an administrator account' });
        }

        user.is_active = req.body.is_active !== undefined ? req.body.is_active : !user.is_active;
        await user.save();

        res.json({ message: `User status updated to ${user.is_active ? 'active' : 'inactive'}`, user });
    } catch (err) {
        console.error('Admin Status Toggle Error:', err);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// 4. POST /api/admin/categories — Create a global predefined category
router.post('/categories', async (req, res) => {
    try {
        const { name, transaction_type, icon_name, color_hex } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const category = await Category.create({
            user_id: null, // Global / Predefined
            name,
            type: 'predefined',
            transaction_type: transaction_type || 'expense',
            icon_name: icon_name || 'folder',
            color_hex: color_hex || '#3b82f6'
        });

        res.status(201).json({ message: 'Global category created successfully', category });
    } catch (err) {
        console.error('Admin Create Category Error:', err);
        res.status(500).json({ error: 'Failed to create global category' });
    }
});

// 5. DELETE /api/admin/categories/:id — Delete a global predefined category
router.delete('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.deleted_at = new Date();
        await category.save();

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Admin Delete Category Error:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;
