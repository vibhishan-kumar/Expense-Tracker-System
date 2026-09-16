/**
 * Input Validation Middleware (Regex & Business Rule Validation)
 */

const REGEX = {
    NAME: /^[A-Za-z\s]{2,100}$/,
    REG_NO: /^[A-Za-z0-9\-_]{3,50}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    PHONE: /^[0-9]{10}$/,
};

// Validate Registration Payload
const validateRegistration = (req, res, next) => {
    const { name, registration_number, email, password, phone_number, semester, student_type } = req.body;

    if (!name || !registration_number || !email || !password || !student_type) {
        return res.status(400).json({ error: 'Missing required registration fields.' });
    }

    if (!REGEX.NAME.test(name.trim())) {
        return res.status(400).json({ error: 'Full name must contain only alphabets and spaces (2-100 characters).' });
    }

    if (!REGEX.REG_NO.test(registration_number.trim())) {
        return res.status(400).json({ error: 'Registration number must be 3-50 alphanumeric characters.' });
    }

    if (!REGEX.EMAIL.test(email.trim())) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!REGEX.PASSWORD.test(password)) {
        return res.status(400).json({
            error: 'Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character (@$!%*?&#).'
        });
    }

    if (phone_number && !REGEX.PHONE.test(phone_number.trim())) {
        return res.status(400).json({ error: 'Phone number must be a 10-digit number.' });
    }

    if (semester !== undefined && semester !== null && semester !== '') {
        const sem = parseInt(semester, 10);
        if (isNaN(sem) || sem < 1 || sem > 12) {
            return res.status(400).json({ error: 'Semester must be an integer between 1 and 12.' });
        }
    }

    if (!['hosteller', 'day_scholar'].includes(student_type)) {
        return res.status(400).json({ error: "Student type must be either 'hosteller' or 'day_scholar'." });
    }

    next();
};

// Validate Transaction Payload
const validateTransaction = (req, res, next) => {
    const { amount, transaction_type, date } = req.body;

    if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ error: 'Transaction amount must be a positive number greater than 0.' });
    }

    if (!transaction_type || !['income', 'expense'].includes(transaction_type)) {
        return res.status(400).json({ error: "Transaction type must be 'income' or 'expense'." });
    }

    if (date && isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Invalid transaction date format.' });
    }

    next();
};

// Validate Budget Payload
const validateBudget = (req, res, next) => {
    const { amount_limit, period_type, alert_threshold } = req.body;

    if (amount_limit === undefined || isNaN(Number(amount_limit)) || Number(amount_limit) <= 0) {
        return res.status(400).json({ error: 'Budget limit must be a positive number greater than 0.' });
    }

    if (!period_type || !['weekly', 'monthly'].includes(period_type)) {
        return res.status(400).json({ error: "Period type must be 'weekly' or 'monthly'." });
    }

    if (alert_threshold !== undefined && (isNaN(Number(alert_threshold)) || Number(alert_threshold) < 1 || Number(alert_threshold) > 100)) {
        return res.status(400).json({ error: 'Alert threshold must be a percentage between 1 and 100.' });
    }

    next();
};

module.exports = {
    REGEX,
    validateRegistration,
    validateTransaction,
    validateBudget
};
