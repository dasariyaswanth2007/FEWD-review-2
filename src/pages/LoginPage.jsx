import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ADMIN_SECURITY_CODE } from '../utils/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setError('');
    if (e.target.value !== 'admin') {
      setAdminCode('');
    }
  };

  const fillCredentials = (role) => {
    setError('');
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@artgallery.com');
      setPassword('admin123');
      setAdminCode(ADMIN_SECURITY_CODE);
      showToast('Filled Admin credentials & Security Code', 'info');
    } else if (role === 'artist') {
      setEmail('artist@artgallery.com');
      setPassword('artist123');
      setAdminCode('');
      showToast('Filled Artist credentials', 'info');
    } else {
      setEmail('user@artgallery.com');
      setPassword('user123');
      setAdminCode('');
      showToast('Filled Buyer / User credentials', 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login({
      selectedRole,
      email,
      password,
      adminCode
    });

    if (res.success) {
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      const role = (res.user.role || '').toLowerCase();
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'artist') {
        navigate('/artist-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="auth-wrapper">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your ArtLoom dashboard, favorites, bids, and purchases.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="loginRole">Login As (Account Type)</label>
              <select
                id="loginRole"
                className="form-control"
                value={selectedRole}
                onChange={handleRoleChange}
                required
              >
                <option value="user">Buyer / User</option>
                <option value="artist">Artist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loginEmail">Email / Username</label>
              <input
                type="text"
                id="loginEmail"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {selectedRole === 'admin' && (
              <div className="form-group">
                <label htmlFor="adminCode">Admin Security Code</label>
                <input
                  type="password"
                  id="adminCode"
                  className="form-control"
                  placeholder="Enter Admin Security Code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />
                <small style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Required for Admin access (Demo Code: <strong>ARTLOOM-ADMIN-2026</strong>)
                </small>
              </div>
            )}

            {error && (
              <div className="form-error show" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Create Account
            </Link>
          </p>

          {/* Quick-Fill Demo Credentials */}
          <div className="demo-credentials-box">
            <h4>⚡ Quick-Fill Demo Credentials (SDC Review)</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Click any role button below to automatically populate test credentials:
            </p>
            <div className="demo-buttons-row">
              <button
                type="button"
                onClick={() => fillCredentials('user')}
                className="btn btn-sm btn-outline"
                style={{ flex: 1 }}
              >
                👤 Buyer / User
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('artist')}
                className="btn btn-sm btn-outline"
                style={{ flex: 1 }}
              >
                🎨 Artist
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="btn btn-sm btn-outline"
                style={{ flex: 1 }}
              >
                👑 Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

