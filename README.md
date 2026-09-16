# Student Expense Tracker

A comprehensive web-based expense tracker designed for students to manage their finances, track income and expenses, and gain insights into their spending habits with Role-Based Access Control (RBAC).

## 🚀 Features

- **User Management & RBAC**: Secure registration and login with JWT and bcrypt. Role-Based Access Control supporting **User (Student)** and **Admin** roles with validated profiles (Course, Semester, Registration Number).
- **Admin Portal**: Dedicated dashboard for administrators to view platform-wide spending metrics, manage student account statuses (active/deactivated), and configure global predefined categories.
- **Transaction Tracking**: Log income and expenses with real-time input validation (Regex for names, registration numbers, emails, and 10-digit phones) with balance protection and soft-delete capabilities.
- **Budgeting**: Set weekly and monthly budgets with automatic filtering of expense categories and threshold alerts.
- **Analytics & Reports**: Visual summaries of spending patterns using interactive charts (Recharts: Pie, Bar, and Line charts) along with university cohort comparisons (Hosteller vs. Day Scholar, Semester-wise).
- **Recurring Bills**: Manage recurring payments like mess dues and semester fees with Auto-Pay options powered by automated cron schedulers.
- **Notifications**: Stay updated with budget alerts, 3-day advance bill reminders, and daily evening expense-logging reminders.

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router, HTML5, CSS3, JavaScript, Recharts, Lucide React.
- **Backend**: Node.js, Express.js, REST API.
- **Database**: PostgreSQL, SQL (with Sequelize ORM; includes MySQL support).
- **Authentication & Security**: JWT (JSON Web Token) & Bcrypt password hashing.
- **Authorization**: RBAC (User & Admin roles with route middleware).
- **Input Validation**: Regex + Backend Validation middleware.

---

## 🚦 Setup Instructions (Running on a new PC)

If you are moving this project to another computer, follow these steps exactly to get it running:

### 1. Prerequisites
Ensure the new computer has these installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** or **MySQL Server** (Ensure it is running)

### 2. Database Setup
The data is stored in your SQL database, which lives outside the project folder. You must recreate it on the new machine:

#### Option A: PostgreSQL Setup (Recommended)
1. Open **pgAdmin** or your terminal and create the database:
   ```sql
   CREATE DATABASE expense_tracker;
