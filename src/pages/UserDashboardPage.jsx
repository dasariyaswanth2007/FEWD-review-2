import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { formatCurrency } from '../utils/storage';

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isUser, logout } = useAuth();
  const { purchases, favorites, bids, reviews } = useGallery();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!isUser) {
      if (currentUser.role === 'admin') navigate('/admin-dashboard');
      else if (currentUser.role === 'artist') navigate('/artist-dashboard');
    }
  }, [currentUser, isUser, navigate]);

  if (!currentUser || !isUser) {
    return null;
  }

  const userFavs = favorites[currentUser.id] || [];
  const userPurchases = purchases.filter((p) => p.userId === currentUser.id);
  const userBids = bids.filter((b) => b.userId === currentUser.id);
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);

  return (
    <main className="main-content">
      {/* Dashboard Greeting Header */}
      <div className="dashboard-header">
        <div className="container dashboard-header-inner">
          <div className="dashboard-greeting">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="role-tag role-user">Collector Account</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• Collector Workspace</span>
            </div>
            <h1>Welcome, {currentUser.name}</h1>
            <p>Track your saved wishlists, acquired collection invoices, and live auction bids.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/artworks" className="btn btn-accent">
              Explore Gallery
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="btn btn-outline"
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* KPI Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-gold">♥</div>
            <div className="stat-info">
              <h3>{userFavs.length}</h3>
              <p>Shortlisted Favorites</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">🛍️</div>
            <div className="stat-info">
              <h3>{userPurchases.length}</h3>
              <p>Purchases &amp; Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">🔨</div>
            <div className="stat-info">
              <h3>{userBids.length}</h3>
              <p>Active Auction Bids</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">⭐</div>
            <div className="stat-info">
              <h3>{userReviews.length}</h3>
              <p>Reviews Given</p>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            margin: '30px 0'
          }}
        >
          <Link
            to="/favorites"
            className="btn btn-outline"
            style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--surface)' }}
          >
            <strong>♥ View Favorites ({userFavs.length})</strong>
          </Link>
          <Link
            to="/purchases"
            className="btn btn-outline"
            style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--surface)' }}
          >
            <strong>📜 Order Receipts ({userPurchases.length})</strong>
          </Link>
          <Link
            to="/auctions"
            className="btn btn-outline"
            style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--surface)' }}
          >
            <strong>🔨 Live Auctions</strong>
          </Link>
          <Link
            to="/reviews"
            className="btn btn-outline"
            style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--surface)' }}
          >
            <strong>⭐ Community Feedback</strong>
          </Link>
        </div>

        {/* Recent Purchases Table */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Recent Purchases</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Artworks acquired and confirmed for delivery.
              </p>
            </div>
            {userPurchases.length > 0 && (
              <Link to="/purchases" className="btn btn-sm btn-outline">
                View All Receipts
              </Link>
            )}
          </div>

          {userPurchases.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No purchases made yet.{' '}
              <Link to="/artworks" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Browse Gallery
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Artwork Name</th>
                    <th>Artist</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userPurchases.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td>#ORD-{p.id}</td>
                      <td>
                        <strong>{p.artworkName}</strong>
                      </td>
                      <td>{p.artist}</td>
                      <td>{formatCurrency(p.price)}</td>
                      <td>
                        <span className="badge badge-sale">{p.status || 'Completed'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

