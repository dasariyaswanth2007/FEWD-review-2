import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = signup({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (res.success) {
      showToast(`Welcome to ArtLoom, ${res.user.name}!`, 'success');
      if (formData.role === 'artist') {
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
        <div className="auth-wrapper" style={{ maxWidth: '520px' }}>
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Join ArtLoom to collect masterpieces, place auction bids, or sell your art.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                placeholder="e.g. Kiran Reddy"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupEmail">Email Address *</label>
              <input
                type="email"
                id="signupEmail"
                name="email"
                className="form-control"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signupRole">Register As *</label>
              <select
                id="signupRole"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">Art Collector / Enthusiast (User)</option>
                <option value="artist">Exhibiting Artist (Artist)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="signupPassword">Password *</label>
                <input
                  type="password"
                  id="signupPassword"
                  name="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Repeat password"
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="form-error show" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-accent btn-block btn-lg">
              Create Account
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

