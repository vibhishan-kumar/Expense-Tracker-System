-- ==========================================
-- FILE: schema_pg.sql
-- PURPOSE: Create Expense Tracker Database for PostgreSQL
-- ==========================================

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS Reports CASCADE;
DROP TABLE IF EXISTS Notifications CASCADE;
DROP TABLE IF EXISTS Recurring_Bills CASCADE;
DROP TABLE IF EXISTS Budgets CASCADE;
DROP TABLE IF EXISTS Transactions CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- Drop existing ENUM types if any
DROP TYPE IF EXISTS student_type_enum CASCADE;
DROP TYPE IF EXISTS category_type_enum CASCADE;
DROP TYPE IF EXISTS transaction_type_enum CASCADE;
DROP TYPE IF EXISTS budget_period_enum CASCADE;

-- Create ENUM types
CREATE TYPE student_type_enum AS ENUM ('hosteller', 'day_scholar');
CREATE TYPE category_type_enum AS ENUM ('predefined', 'custom');
CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');
CREATE TYPE budget_period_enum AS ENUM ('weekly', 'monthly');

-- 1. Users Table (with RBAC role)
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    course VARCHAR(100),
    student_type student_type_enum NOT NULL DEFAULT 'hosteller',
    hostel_name VARCHAR(100), -- Nullable for day scholars
    semester INT CHECK (semester >= 1 AND semester <= 12),
    scholarship_amount NUMERIC(10, 2) DEFAULT 0.00,
    profile_image VARCHAR(255),
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    user_id INT NULL, -- Nullable for system-predefined categories
    name VARCHAR(50) NOT NULL,
    type category_type_enum NOT NULL DEFAULT 'custom',
    transaction_type VARCHAR(20) DEFAULT 'expense' CHECK (transaction_type IN ('income', 'expense', 'both')),
    icon_name VARCHAR(50),
    color_hex VARCHAR(7),
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Transactions Table (Unified Ledger)
CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    transaction_type transaction_type_enum NOT NULL,
    source_or_description TEXT,
    date TIMESTAMPTZ NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- 4. Budgets Table
CREATE TABLE Budgets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NULL,
    period_type budget_period_enum NOT NULL,
    amount_limit NUMERIC(10, 2) NOT NULL CHECK (amount_limit > 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    alert_threshold INT DEFAULT 80 CHECK (alert_threshold BETWEEN 1 AND 100),
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_budgets_category FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- 5. Recurring Bills Table
CREATE TABLE Recurring_Bills (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    frequency VARCHAR(50) DEFAULT 'monthly', -- 'daily', 'weekly', 'monthly'
    due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_auto_post BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL DEFAULT NULL,
    CONSTRAINT fk_recurring_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recurring_category FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
);

-- 6. Notifications Table
CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50),
    title VARCHAR(100),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    due_date DATE,
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 7. Reports Table
CREATE TABLE Reports (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    report_type VARCHAR(50),
    from_date DATE,
    to_date DATE,
    file_path VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Performance Indexes
CREATE INDEX idx_transactions_user_date ON Transactions(user_id, date);
CREATE INDEX idx_categories_user ON Categories(user_id);
CREATE INDEX idx_budgets_user ON Budgets(user_id);
CREATE INDEX idx_recurring_bills_user ON Recurring_Bills(user_id, due_date);
CREATE INDEX idx_notifications_user_read ON Notifications(user_id, is_read);
