import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { formatCurrency } from '../utils/storage';
import ArtworkModal from '../components/ArtworkModal';

export default function ArtistDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, isArtist, logout } = useAuth();
  const { artworks, purchases, reviews, addArtwork, updateArtwork, deleteArtwork } = useGallery();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (!isArtist) {
      if (currentUser.role === 'admin') navigate('/admin-dashboard');
      else navigate('/user-dashboard');
    }
  }, [currentUser, isArtist, navigate]);

  if (!currentUser || !isArtist) {
    return null;
  }

  // Filter artworks created by this artist
  const myArtworks = artworks.filter(
    (a) => a.artist === currentUser.name || a.artistId === currentUser.id
  );
  const myArtIds = myArtworks.map((a) => a.id);

  const myPurchases = purchases.filter((p) => p.artist === currentUser.name);
  const myAuctions = myArtworks.filter((a) => a.type === 'Auction');
  const myReviews = reviews.filter((r) => myArtIds.includes(r.artworkId));

  const totalSalesVal = myPurchases.reduce((sum, p) => sum + Number(p.price || 0), 0);

  const handleOpenUpload = () => {
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
      addArtwork({
        ...formData,
        artist: currentUser.name,
        artistId: currentUser.id
      });
    }
    setModalOpen(false);
    setEditingArtwork(null);
  };

  const handleDelete = (art) => {
    if (window.confirm(`Are you sure you want to delete artwork "${art.name}"?`)) {
      deleteArtwork(art.id);
    }
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      <div className="dashboard-header">
        <div className="container dashboard-header-inner">
          <div className="dashboard-greeting">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="role-tag role-artist">Exhibiting Artist</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• Studio Portal</span>
            </div>
            <h1>Welcome, Artist {currentUser.name}</h1>
            <p>Showcase your portfolio, upload new creations, monitor sales revenue, and track auction bids.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to={`/artists?artist=${encodeURIComponent(currentUser.name)}`}
              className="btn btn-outline"
            >
              View Public Profile
            </Link>
            <button onClick={handleOpenUpload} className="btn btn-accent" type="button">
              + Upload New Artwork
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
        {/* KPI Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-gold">🖼️</div>
            <div className="stat-info">
              <h3>{myArtworks.length}</h3>
              <p>My Exhibited Works</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">💰</div>
            <div className="stat-info">
              <h3>{formatCurrency(totalSalesVal)}</h3>
              <p>Total Sales Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">🔨</div>
            <div className="stat-info">
              <h3>{myAuctions.length}</h3>
              <p>Active Auction Lots</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">⭐</div>
            <div className="stat-info">
              <h3>{myReviews.length}</h3>
              <p>Collector Reviews</p>
            </div>
          </div>
        </div>

        {/* My Artworks Table */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)',
            marginTop: '30px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Art Portfolio</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage pieces displayed in the public gallery and live auctions.
              </p>
            </div>
            <button onClick={handleOpenUpload} className="btn btn-sm btn-accent" type="button">
              + Upload Artwork
            </button>
          </div>

          {myArtworks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎨</div>
              <h3>No Artworks Uploaded Yet</h3>
              <p>Click "Upload Artwork" above to exhibit your first original creation.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Price / High Bid</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myArtworks.map((art) => (
                    <tr key={art.id}>
                      <td>#{art.id}</td>
                      <td>
                        <img
                          src={art.image}
                          alt={art.name}
                          style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
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
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(art)}
                            className="btn btn-sm btn-danger"
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
          )}
        </div>
      </div>

      {modalOpen && (
        <ArtworkModal
          artwork={editingArtwork}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveArtwork}
          isArtistRole={true}
          defaultArtistName={currentUser.name}
        />
      )}
    </main>
  );
}

