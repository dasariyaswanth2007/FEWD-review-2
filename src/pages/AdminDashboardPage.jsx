import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/storage';
import ArtworkModal from '../components/ArtworkModal';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const {
    artworks,
    categories,
    purchases,
    reviews,
    usersList,
    deleteArtwork,
    addArtwork,
    updateArtwork,
    deleteUser,
    deleteReview,
    endAuction
  } = useGallery();

  const [activeTab, setActiveTab] = useState('tabArtworks');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!isAdmin) {
      if (currentUser.role === 'artist') navigate('/artist-dashboard');
      else navigate('/user-dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  if (!currentUser || !isAdmin) {
    return null;
  }

  // Calculate KPIs
  const totalUsers = usersList.length;
  const totalArtists = usersList.filter((u) => (u.role || '').toLowerCase() === 'artist').length;
  const totalArtworks = artworks.length;
  const totalPurchases = purchases.length;
  const totalAuctions = artworks.filter((a) => a.type === 'Auction' && a.status !== 'closed').length;
  const totalReviews = reviews.length;
  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const handleOpenAdd = () => {
    setEditingArtwork(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArtwork(art);
    setModalOpen(true);
  };

  const handleSaveArtwork = (formData) => {
    if (editingArtwork) {
      updateArtwork(editingArtwork.id, formData);
    } else {
      addArtwork(formData);
    }
    setModalOpen(false);
    setEditingArtwork(null);
  };

  const handleDeleteArtwork = (art) => {
    if (window.confirm(`Are you sure you want to delete artwork "${art.name}" (#${art.id})?`)) {
      deleteArtwork(art.id);
    }
  };

  const handleDeleteUser = (user) => {
    if (user.id === currentUser.id) {
      showToast('Cannot delete the logged-in admin account.', 'warning');
      return;
    }
    if (window.confirm(`Are you sure you want to remove user "${user.name}"?`)) {
      deleteUser(user.id);
    }
  };

  const handleDeleteReview = (rev) => {
    if (window.confirm('Delete this review?')) {
      deleteReview(rev.id);
    }
  };

  const handleEndAuction = (art) => {
    if (window.confirm(`End live auction for "${art.name}"?`)) {
      endAuction(art.id);
    }
  };

  return (
    <main className="main-content">
      {/* Dashboard Banner */}
      <div className="dashboard-header">
        <div className="container dashboard-header-inner">
          <div className="dashboard-greeting">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="role-tag role-admin">System Administrator</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• SDC Evaluation Mode</span>
            </div>
            <h1>Admin Control Center</h1>
            <p>Monitor platform statistics, moderate users, manage artworks, categories, purchases, and auctions.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleOpenAdd} className="btn btn-accent" type="button">
              + Add New Artwork
            </button>
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
        {/* KPI Metric Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">👥</div>
            <div className="stat-info">
              <h3>{totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-gold">🎨</div>
            <div className="stat-info">
              <h3>{totalArtists}</h3>
              <p>Total Artists</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">🖼️</div>
            <div className="stat-info">
              <h3>{totalArtworks}</h3>
              <p>Total Artworks</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">🛍️</div>
            <div className="stat-info">
              <h3>{totalPurchases}</h3>
              <p>Total Purchases</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-gold">🔨</div>
            <div className="stat-info">
              <h3>{totalAuctions}</h3>
              <p>Live Auctions</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">⭐</div>
            <div className="stat-info">
              <h3>{totalReviews}</h3>
              <p>Total Reviews</p>
            </div>
          </div>

          <div className="stat-card" style={{ gridColumn: 'span 2' }}>
            <div className="stat-icon stat-icon-green">💰</div>
            <div className="stat-info">
              <h3>{formatCurrency(totalRevenue)}</h3>
              <p>Platform Sales Volume</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`dash-tab-btn ${activeTab === 'tabArtworks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabArtworks')}
            type="button"
          >
            Manage Artworks
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'tabUsers' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabUsers')}
            type="button"
          >
            Manage Users
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'tabCategories' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabCategories')}
            type="button"
          >
            Manage Categories
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'tabPurchases' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabPurchases')}
            type="button"
          >
            Purchases Log
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'tabAuctions' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabAuctions')}
            type="button"
          >
            Auctions Log
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'tabReviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('tabReviews')}
            type="button"
          >
            Reviews Moderation
          </button>
        </div>

        {/* Tab 1: Artworks */}
        {activeTab === 'tabArtworks' && (
          <div className="tab-pane active">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Catalog Artworks</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Add, edit metadata, update prices, or remove artworks from gallery.
                </p>
              </div>
              <button onClick={handleOpenAdd} className="btn btn-sm btn-accent" type="button">
                + Add Artwork
              </button>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Thumbnail</th>
                    <th>Artwork Name</th>
                    <th>Artist</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Price / Bid</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map((art) => (
                    <tr key={art.id}>
                      <td>#{art.id}</td>
                      <td>
                        <img
                          src={art.image}
                          alt={art.name}
                          style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/artworks/artwork-1.svg';
                          }}
                        />
                      </td>
                      <td>
                        <Link to={`/artwork/${art.id}`} style={{ fontWeight: 600 }}>
                          {art.name}
                        </Link>
                      </td>
                      <td>{art.artist}</td>
                      <td>
                        <span className="badge badge-category">{art.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${art.type === 'Auction' ? 'badge-auction' : 'badge-sale'}`}>
                          {art.type}
                        </span>
                      </td>
                      <td>
                        <strong>{formatCurrency(art.type === 'Auction' ? art.currentBid || art.price : art.price)}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEdit(art)}
                            className="btn btn-sm btn-outline"
                            title="Edit"
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArtwork(art)}
                            className="btn btn-sm btn-danger"
                            title="Delete"
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
        {activeTab === 'tabUsers' && (
          <div className="tab-pane active">
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Registered Users &amp; Roles</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Inspect registered collectors, artists, and system administrators.
              </p>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={u.avatar || '/images/avatar-user.svg'}
                            alt={u.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                            onError={(e) => {
                              e.currentTarget.src = '/images/avatar-user.svg';
                            }}
                          />
                          <strong>{u.name}</strong>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-tag role-${(u.role || '').toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{u.createdAt}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="btn btn-sm btn-danger"
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'tabCategories' && (
          <div className="tab-pane active">
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Artwork Categories &amp; Catalog Distribution</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Curated categories and active artwork density.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {categories.map((cat) => {
                const count = artworks.filter((a) => a.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div
                    key={cat.id}
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ fontSize: '2.4rem' }}>{cat.icon}</div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                        {cat.description}
                      </p>
                      <span className="badge badge-category">{count} Artworks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Purchases Log */}
        {activeTab === 'tabPurchases' && (
          <div className="tab-pane active">
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Transactions &amp; Purchases Log</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Audit trail of all artwork acquisitions made across the platform.
              </p>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Artwork</th>
                    <th>Buyer</th>
                    <th>Artist</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id}>
                      <td>#ORD-{p.id}</td>
                      <td>
                        <strong>{p.artworkName}</strong>
                      </td>
                      <td>{p.userName}</td>
                      <td>{p.artist}</td>
                      <td>
                        <strong>{formatCurrency(p.price)}</strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{p.date}</td>
                      <td>
                        <span className="badge badge-sale">{p.status || 'Completed'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Auctions Log */}
        {activeTab === 'tabAuctions' && (
          <div className="tab-pane active">
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Active Auction Items</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Current highest bids and bidders on all active auction lots.
              </p>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Lot ID</th>
                    <th>Artwork</th>
                    <th>Artist</th>
                    <th>Starting Price</th>
                    <th>Current High Bid</th>
                    <th>Top Bidder</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks
                    .filter((a) => a.type === 'Auction')
                    .map((art) => (
                      <tr key={art.id}>
                        <td>#LOT-{art.id}</td>
                        <td>
                          <Link to={`/artwork/${art.id}`} style={{ fontWeight: 600 }}>
                            {art.name}
                          </Link>
                        </td>
                        <td>{art.artist}</td>
                        <td>{formatCurrency(art.startingPrice || art.price)}</td>
                        <td>
                          <strong style={{ color: 'var(--accent)' }}>
                            {formatCurrency(art.currentBid || art.price)}
                          </strong>
                        </td>
                        <td>{art.currentBidder || 'None yet'}</td>
                        <td>
                          {art.status === 'closed' ? (
                            <span className="badge badge-category">Closed</span>
                          ) : (
                            <button
                              onClick={() => handleEndAuction(art)}
                              className="btn btn-sm btn-outline"
                              type="button"
                            >
                              End Auction
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Reviews Moderation */}
        {activeTab === 'tabReviews' && (
          <div className="tab-pane active">
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Community Reviews &amp; Ratings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Moderate collector feedback and star ratings.
              </p>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Artwork</th>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev.id}>
                      <td>#{rev.id}</td>
                      <td>
                        <Link to={`/artwork/${rev.artworkId}`} style={{ fontWeight: 600 }}>
                          {rev.artworkName}
                        </Link>
                      </td>
                      <td>{rev.userName}</td>
                      <td style={{ color: '#f59e0b' }}>
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </td>
                      <td style={{ maxWidth: '300px' }}>"{rev.comment}"</td>
                      <td>
                        <button
                          onClick={() => handleDeleteReview(rev)}
                          className="btn btn-sm btn-danger"
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ArtworkModal
          artwork={editingArtwork}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveArtwork}
          isArtistRole={false}
        />
      )}
    </main>
  );
}

