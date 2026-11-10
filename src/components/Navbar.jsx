import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { currentUser, role, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'artist') return '/artist-dashboard';
    return '/user-dashboard';
  };

  const getDashboardLabel = () => {
    if (role === 'admin') return 'Admin Dashboard';
    if (role === 'artist') return 'Artist Dashboard';
    return 'User Dashboard';
  };

  const getAvatarUrl = () => {
    if (currentUser?.avatar) return currentUser.avatar;
    if (role === 'artist') return '/images/avatar-artist.svg';
    if (role === 'admin') return '/images/avatar-admin.svg';
    return '/images/avatar-user.svg';
  };

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <img src="/images/logo.svg" alt="ArtLoom Logo" />
        </Link>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Toggle Navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'show' : ''}`} id="navLinks">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/artworks"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/artists"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Artists
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/auctions"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Auctions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reviews"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </NavLink>
          </li>

          {currentUser && (
            <li>
              <NavLink
                to={getDashboardPath()}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                {getDashboardLabel()}
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-actions" id="navActions">
          {currentUser ? (
            <>
              <div className="user-badge-pill">
                <img
                  src={getAvatarUrl()}
                  alt={currentUser.name}
                  className="user-avatar-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/images/avatar-user.svg';
                  }}
                />
                <span>{currentUser.name.split(' ')[0]}</span>
                <span className={`role-tag role-${role}`}>{currentUser.role}</span>
              </div>
              <Link to={getDashboardPath()} className="btn btn-sm btn-primary">
                {getDashboardLabel()}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline"
                title="Logout"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `btn btn-sm btn-outline ${isActive ? 'active' : ''}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) => `btn btn-sm btn-accent ${isActive ? 'active' : ''}`}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

