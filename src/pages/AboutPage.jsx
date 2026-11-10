import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Hero / Header */}
        <div className="section-header" style={{ textAlign: 'left', maxWidth: '800px', marginBottom: '40px' }}>
          <span className="section-subtitle">Academic Project Overview</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>About ArtLoom Online Art Gallery</h1>
          <p className="section-desc" style={{ fontSize: '1.15rem', lineHeight: 1.7 }}>
            ArtLoom is a comprehensive web-based platform engineered for <strong>SDC Project Review-2</strong>.
            Converted into a modern <strong>React Single-Page Application (SPA)</strong> with component architecture,
            state management, client-side routing, and responsive CSS Grid/Flexbox layouts.
          </p>
        </div>

        {/* Problem Statement & Solution */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px' }}>The Problem Statement</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Traditional art commerce often restricts emerging independent creators due to high intermediary gallery
              fees, lack of digital exhibition avenues, and opaque auction mechanisms. Collectors conversely struggle
              to discover genuine artworks across varied categories with transparent pricing and live bidding.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💡</div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px' }}>The ArtLoom Solution</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              ArtLoom provides an online gallery where artists manage their portfolios, collectors discover and
              acquire works or participate in live auctions, and administrators maintain catalog integrity. Converted
              to React for modularity, reusability, and instant reactive state updates.
            </p>
          </div>
        </div>

        {/* Technology Stack & Architecture Card */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '40px'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '18px' }}>
            🛠️ Review-2 React Technology Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>⚛️ React 18+</strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Component-based UI with hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
                🧭 React Router DOM
              </strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Declarative client-side routing, protected routes, URL query filters, and breadcrumbs.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
                📦 Context API State
              </strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Centralized `AuthContext`, `GalleryContext`, and `ToastContext` for state persistence.
              </p>
            </div>

            <div style={{ padding: '16px', backgroundColor: 'var(--surface-alt)', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
                🎨 CSS Grid &amp; Flexbox
              </strong>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Zero heavy CSS frameworks: responsive design tokens, mobile navigation, and modern typography.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials Table */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '40px'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '14px' }}>
            🔑 Pre-Configured Demo Credentials
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
            Use the credentials below or click the Quick-Fill buttons on the Login page for evaluator demonstration:
          </p>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Admin Security Code</th>
                  <th>Landing View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="role-tag role-admin">Admin</span>
                  </td>
                  <td><code>admin@artgallery.com</code></td>
                  <td><code>admin123</code></td>
                  <td><code>ARTLOOM-ADMIN-2026</code></td>
                  <td><Link to="/admin-dashboard">Admin Control Center</Link></td>
                </tr>
                <tr>
                  <td>
                    <span className="role-tag role-user">Buyer / User</span>
                  </td>
                  <td><code>user@artgallery.com</code></td>
                  <td><code>user123</code></td>
                  <td><em>Not Required</em></td>
                  <td><Link to="/user-dashboard">User Dashboard</Link></td>
                </tr>
                <tr>
                  <td>
                    <span className="role-tag role-artist">Artist</span>
                  </td>
                  <td><code>artist@artgallery.com</code></td>
                  <td><code>artist123</code></td>
                  <td><em>Not Required</em></td>
                  <td><Link to="/artist-dashboard">Artist Studio</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

