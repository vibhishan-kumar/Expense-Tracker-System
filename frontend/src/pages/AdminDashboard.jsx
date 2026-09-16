import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  DollarSign, 
  Search, 
  UserCheck, 
  UserX, 
  PlusCircle, 
  Trash2, 
  LayoutDashboard, 
  LogOut, 
  Layers 
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: '',
    transaction_type: 'expense',
    color_hex: '#6366f1',
    icon_name: 'folder'
  });
  const [catMessage, setCatMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, catRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/categories')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, { is_active: !currentStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
      if (stats) {
        setStats({
          ...stats,
          users: {
            ...stats.users,
            active: currentStatus ? stats.users.active - 1 : stats.users.active + 1,
            inactive: currentStatus ? stats.users.inactive + 1 : stats.users.inactive - 1
          }
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user status');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      const res = await axios.post('/api/admin/categories', newCategory);
      setCategories(prev => [...prev, res.data.category]);
      setNewCategory({ name: '', transaction_type: 'expense', color_hex: '#6366f1', icon_name: 'folder' });
      setCatMessage('Category created successfully!');
      setTimeout(() => setCatMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to remove this category?')) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0f172a)', color: 'var(--text-primary, #f8fafc)', padding: '24px 32px' }}>
      {/* Navbar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
            padding: '10px', 
            borderRadius: '12px',
            display: 'flex'
          }}>
            <ShieldCheck size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>System Administration Portal</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Role-Based Access Control (RBAC) &bull; Logged in as: <span style={{ color: '#a855f7', fontWeight: 600 }}>{user?.email}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/dashboard" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(255, 255, 255, 0.08)', 
              color: '#f8fafc',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            <LayoutDashboard size={18} /> Student View
          </Link>
          <button 
            onClick={logout} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(239, 68, 68, 0.15)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', fontSize: '1.2rem', color: '#94a3b8' }}>
          Loading administrative analytics...
        </div>
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '20px', 
            marginBottom: '32px' 
          }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Registered Students</span>
                <Users size={20} color="#60a5fa" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats?.users?.total || 0}</div>
              <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '4px' }}>
                {stats?.users?.active || 0} Active &bull; {stats?.users?.inactive || 0} Inactive
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total System Expenses</span>
                <DollarSign size={20} color="#f87171" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                ₹{stats?.transactions?.totalExpenses?.toLocaleString('en-IN') || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                Across {stats?.transactions?.count || 0} transactions
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total System Income</span>
                <Activity size={20} color="#4ade80" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                ₹{stats?.transactions?.totalIncome?.toLocaleString('en-IN') || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                Allowances & Scholarships
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Global Categories</span>
                <Layers size={20} color="#c084fc" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats?.categories || 0}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                {stats?.budgets || 0} Active Budgets tracked
              </div>
            </div>
          </div>

          {/* Student Management Table */}
          <div className="glass-panel" style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            background: 'rgba(30, 41, 59, 0.7)', 
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 4px 0' }}>Student Directory & Permissions</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  Manage student account status and view financial footprints
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search student, reg no, course..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#f8fafc', outline: 'none', fontSize: '0.9rem', width: '220px' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                    <th style={{ padding: '12px' }}>Name / Reg No</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Course / Sem</th>
                    <th style={{ padding: '12px' }}>Type / Hostel</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Total Spent</th>
                    <th style={{ padding: '12px' }}>Account Status</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        No students found matching "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.registration_number}</div>
                        </td>
                        <td style={{ padding: '12px', color: '#cbd5e1' }}>{u.email}</td>
                        <td style={{ padding: '12px' }}>{u.course || 'N/A'} (Sem {u.semester || '-'})</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '3px 8px', 
                            borderRadius: '6px', 
                            background: u.student_type === 'hosteller' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                            color: u.student_type === 'hosteller' ? '#60a5fa' : '#c084fc'
                          }}>
                            {u.student_type === 'hosteller' ? (u.hostel_name ? `Hostel (${u.hostel_name})` : 'Hosteller') : 'Day Scholar'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            background: u.role === 'admin' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                            color: u.role === 'admin' ? '#facc15' : '#cbd5e1',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#f87171' }}>
                          ₹{Number(u.total_spent || 0).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: u.is_active ? '#4ade80' : '#f87171',
                            fontSize: '0.85rem',
                            fontWeight: 500
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.is_active ? '#4ade80' : '#f87171' }} />
                            {u.is_active ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {u.role === 'admin' ? (
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Protected</span>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(u.id, u.is_active)}
                              style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: u.is_active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                color: u.is_active ? '#f87171' : '#4ade80',
                                border: `1px solid ${u.is_active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                                padding: '5px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                              {u.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Global Predefined Categories Manager */}
          <div className="glass-panel" style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            background: 'rgba(30, 41, 59, 0.7)', 
            border: '1px solid rgba(255, 255, 255, 0.08)' 
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 4px 0' }}>Global Category Management</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Create and manage default categories accessible to all students
            </p>

            {catMessage && (
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
                {catMessage}
              </div>
            )}

            <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Category Name (e.g. Gym, Library)" 
                required
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                style={{ 
                  flex: '1', 
                  minWidth: '200px', 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  background: 'rgba(15, 23, 42, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                }}
              />

              <select
                value={newCategory.transaction_type}
                onChange={(e) => setNewCategory({ ...newCategory, transaction_type: e.target.value })}
                style={{ 
                  padding: '10px 14px', 
                  borderRadius: '8px', 
                  background: '#1e293b', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff'
                }}
              >
                <option value="expense">Expense Category</option>
                <option value="income">Income Category</option>
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Color:</label>
                <input 
                  type="color" 
                  value={newCategory.color_hex}
                  onChange={(e) => setNewCategory({ ...newCategory, color_hex: e.target.value })}
                  style={{ width: '40px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '10px 18px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <PlusCircle size={16} /> Add Global Category
              </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {categories.map(c => (
                <div 
                  key={c.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px 14px', 
                    borderRadius: '8px', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)' 
                  }}
                >
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.color_hex || '#3b82f6' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>({c.transaction_type})</span>
                  {c.type === 'predefined' && (
                    <button 
                      onClick={() => handleDeleteCategory(c.id)}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', padding: '2px' }}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
