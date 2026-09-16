-- ==========================================
-- FILE: seed_pg.sql
-- PURPOSE: Insert sample data & admin for PostgreSQL
-- ==========================================

-- 1. Seed Users (Students + System Admin)
INSERT INTO Users (name, registration_number, email, password_hash, role, course, student_type, hostel_name, semester) VALUES
('System Administrator', 'ADMIN001', 'admin@uoh.edu', '$2b$10$3Kq0gq6.rrQ8F4EwIypGPOciUOKjWzCeyceMgMWcIR0n/U.BLE/li', 'admin', 'Administration', 'day_scholar', NULL, 1),
('Rahul Sharma', 'UOH23001', 'rahul@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'CS', 'hosteller', 'NRS', 3),
('Priya Das', 'UOH23002', 'priya@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'Math', 'day_scholar', NULL, 3),
('Ankit Verma', 'UOH23003', 'ankit@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'Physics', 'hosteller', 'MH', 5),
('Sneha Reddy', 'UOH23004', 'sneha@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'CS', 'hosteller', 'LH', 1),
('Vikram Singh', 'UOH23005', 'vikram@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'Economics', 'day_scholar', NULL, 4),
('Megha Iyer', 'UOH23006', 'megha@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'Biology', 'hosteller', 'NRS', 2),
('Arjun Nair', 'UOH23007', 'arjun@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'CS', 'hosteller', 'MH', 3),
('Kriti Pal', 'UOH23008', 'kriti@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'Philosophy', 'day_scholar', NULL, 6),
('Siddharth J.', 'UOH23009', 'sid@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'Chemistry', 'hosteller', 'LH', 4),
('Ayesha Khan', 'UOH23010', 'ayesha@uoh.edu', '$2b$10$gF7L99AuQb4aiacQWSV2X.RR7gaN3rF4Dt0uDrL70Iokynebk2bEe', 'user', 'CS', 'hosteller', 'NRS', 2),
('VIBHISHAN KUMAR', '25MCMC26', 'imvibhishankumar@gmail.com', '$2b$10$tJJRrHNKQA/2M40sPxLHJuDLJ3Io3BLdnDMppdsvbo1kALSt6w58a', 'user', 'MCA', 'hosteller', 'MH-L', 3);

-- 2. Seed Predefined Categories (Income & Expense)
INSERT INTO Categories (user_id, name, type, transaction_type, icon_name, color_hex) VALUES
(NULL, 'Parent Allowance', 'predefined', 'income', 'users', '#4DB6AC'),
(NULL, 'Scholarship', 'predefined', 'income', 'graduation-cap', '#8C82FC'),
(NULL, 'Salary/Freelance', 'predefined', 'income', 'briefcase', '#FFD54F'),
(NULL, 'Other Income', 'predefined', 'income', 'plus-circle', '#AED581'),
(NULL, 'Mess food', 'predefined', 'expense', 'utensils', '#FF5733'),
(NULL, 'Travel', 'predefined', 'expense', 'bus', '#33FF57'),
(NULL, 'Rent', 'predefined', 'expense', 'home', '#3357FF'),
(NULL, 'Laundry', 'predefined', 'expense', 'tshirt', '#F333FF'),
(NULL, 'Shopping', 'predefined', 'expense', 'shopping-cart', '#FFFF33'),
(NULL, 'Events', 'predefined', 'expense', 'calendar', '#33FFFF'),
(NULL, 'Dining out', 'predefined', 'expense', 'hamburger', '#FF8C33'),
(NULL, 'Utilities', 'predefined', 'expense', 'bolt', '#33FFBD'),
(NULL, 'Study materials', 'predefined', 'expense', 'book', '#7D33FF'),
(NULL, 'Health', 'predefined', 'expense', 'heartbeat', '#FF3385'),
(NULL, 'Other Expense', 'predefined', 'expense', 'ellipsis-h', '#B2BABB');

-- 3. Seed Transactions
INSERT INTO Transactions (user_id, category_id, amount, transaction_type, source_or_description, date) VALUES
(2, 1, 10000.00, 'income', 'Monthly Allowance from Dad', '2026-04-01 10:00:00+05:30'),
(2, 3, 2500.00, 'income', 'Part-time Web Dev Gig', '2026-04-10 14:30:00+05:30'),
(2, 5, 2500.00, 'expense', 'Monthly Mess Dues', '2026-04-05 09:00:00+05:30'),
(2, 6, 150.00, 'expense', 'Auto to University Library', '2026-04-06 11:15:00+05:30'),
(2, 11, 450.00, 'expense', 'Pizza Night with Friends', '2026-04-12 20:00:00+05:30'),
(2, 13, 1200.00, 'expense', 'New Lab Coat & Books', '2026-04-15 16:45:00+05:30'),
(2, 6, 80.00, 'expense', 'Bus to City Center', '2026-04-18 10:30:00+05:30'),
(2, 11, 300.00, 'expense', 'Lunch at Canteen', '2026-04-20 13:00:00+05:30'),
(2, 9, 2000.00, 'expense', 'New Sneakers', '2026-04-22 18:20:00+05:30'),
(2, 8, 400.00, 'expense', 'Electricity Bill Share', '2026-04-25 10:00:00+05:30'),
(3, 2, 15000.00, 'income', 'Merit Scholarship', '2026-04-01 09:00:00+05:30'),
(4, 4, 3000.00, 'income', 'Sold Old Textbook', '2026-04-10 12:00:00+05:30'),
(5, 6, 500.00, 'expense', 'Travel to Home', '2026-04-12 08:30:00+05:30'),
(6, 13, 1200.00, 'expense', 'Reference books', '2026-04-15 15:00:00+05:30'),
(7, 3, 2000.00, 'income', 'Freelance design work', '2026-04-16 11:00:00+05:30'),
(8, 11, 450.00, 'expense', 'Dinner at DLF', '2026-04-18 21:00:00+05:30'),
(9, 14, 300.00, 'expense', 'Pharmacy medicine', '2026-04-18 19:30:00+05:30'),
(10, 3, 1000.00, 'income', 'Part-time job', '2026-04-19 14:00:00+05:30'),
(12, 1, 8000.00, 'income', 'Monthly Allowance', '2026-04-01 09:00:00+05:30'),
(12, 5, 2500.00, 'expense', 'Mess Bill Paid', '2026-04-05 12:00:00+05:30'),
(12, 13, 650.00, 'expense', 'Study Materials & Stationary', '2026-04-10 15:00:00+05:30');

-- 4. Seed Budgets
INSERT INTO Budgets (user_id, category_id, period_type, amount_limit, start_date, end_date) VALUES
(2, 5, 'monthly', 3000.00, '2026-04-01', '2026-04-30'),
(3, 2, 'weekly', 500.00, '2026-04-19', '2026-04-25'),
(4, 9, 'monthly', 1000.00, '2026-04-01', '2026-04-30'),
(5, 5, 'monthly', 2800.00, '2026-04-01', '2026-04-30'),
(6, NULL, 'monthly', 10000.00, '2026-04-01', '2026-04-30'),
(7, 4, 'weekly', 200.00, '2026-04-19', '2026-04-25'),
(12, 5, 'monthly', 3000.00, '2026-04-01', '2026-04-30');

-- 5. Seed Recurring Bills
INSERT INTO Recurring_Bills (user_id, category_id, title, amount, frequency, due_date, is_auto_post) VALUES
(2, 5, 'Mess dues', 2500.00, 'monthly', '2026-05-01', TRUE),
(4, 3, 'Hostel fees', 12000.00, '6 months', '2026-06-15', FALSE),
(3, 2, 'Transport pass', 500.00, 'monthly', '2026-05-01', TRUE),
(5, 5, 'Mess dues', 2800.00, 'monthly', '2026-05-01', TRUE),
(12, 5, 'Hostel Mess Bill', 2500.00, 'monthly', '2026-05-01', TRUE);

-- 6. Seed Notifications
INSERT INTO Notifications (user_id, type, title, message) VALUES
(2, 'Daily expense reminder', 'Log Expenses', 'Do not forget to log your coffee expense!'),
(3, 'Budget warning', 'Transport Budget', 'You have used 85% of your travel budget.'),
(12, 'Daily expense reminder', 'Welcome', 'Welcome to Student Expense Tracker!');
