import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-grid">
          <div className="footer-col">
            <img
              src="/images/logo.svg"
              alt="ArtLoom"
              style={{ height: '42px', marginBottom: '16px', filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '320px', lineHeight: 1.6 }}>
              ArtLoom is an online art gallery connecting discerning collectors with visionary independent artists.
              Converted to modern React for SDC Project Review-2.
            </p>
            <div style={{ marginTop: '14px' }}>
              <span className="role-tag role-admin" style={{ backgroundColor: '#312e81', color: '#c7d2fe' }}>
                SDC Project Review-2 (React)
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/artworks">Full Gallery</Link></li>
              <li><Link to="/auctions">Live Auctions</Link></li>
              <li><Link to="/artists">Featured Artists</Link></li>
              <li><Link to="/reviews">Community Reviews</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/about">About ArtLoom</Link></li>
              <li><Link to="/login">Member Login</Link></li>
              <li><Link to="/signup">Register Account</Link></li>
              <li><Link to="/favorites">My Favorites</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Review Demonstration</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '12px' }}>
              Built with React, React Router &amp; LocalStorage. Single-Page Application with role-based features.
            </p>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong>Demo Accounts:</strong><br />
              Admin: admin@artgallery.com (Code: ARTLOOM-ADMIN-2026)<br />
              User: user@artgallery.com<br />
              Artist: artist@artgallery.com
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <div>&copy; 2026 ArtLoom Online Art Gallery. All rights reserved.</div>
        <div>Developed for SDC Project Review-2 (React • React Router • CSS3 Grid/Flexbox • Local Storage)</div>
      </div>
    </footer>
  );
}

