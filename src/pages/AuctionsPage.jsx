import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/storage';

export default function AuctionsPage() {
  const { artworks, bids, placeBid } = useGallery();
  const { currentUser } = useAuth();

  const auctionArtworks = artworks.filter((a) => a.type === 'Auction' && a.status !== 'closed');
  const userBids = currentUser ? bids.filter((b) => b.userId === currentUser.id) : [];

  const [bidInputs, setBidInputs] = useState({});

  const handleBidInputChange = (artworkId, value) => {
    setBidInputs((prev) => ({ ...prev, [artworkId]: value }));
  };

  const handleQuickBid = (e, art) => {
    e.preventDefault();
    const val = Number(bidInputs[art.id]);
    const res = placeBid(art.id, val);
    if (res.success) {
      setBidInputs((prev) => ({ ...prev, [art.id]: '' }));
    }
  };

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <span className="section-subtitle">Real-time Bidding Room</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Live Art Auctions</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              Place competitive bids on rare originals directly from verified artists.
            </p>
          </div>
          <div>
            <span className="badge badge-auction" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {auctionArtworks.length} Live Auctions
            </span>
          </div>
        </div>

        {/* Live Auction Lots Grid */}
        {auctionArtworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔨</div>
            <h3>No Live Auctions Currently</h3>
            <p>Check back soon for new curated live auction pieces.</p>
            <Link to="/artworks" className="btn btn-primary">
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="artwork-grid" style={{ marginBottom: '50px' }}>
            {auctionArtworks.map((art) => {
              const currentHighest = Number(art.currentBid || art.price);
              const minNextBid = currentHighest + 500;

              return (
                <div key={art.id} className="artwork-card">
                  <div className="artwork-image-wrap">
                    <img
                      src={art.image}
                      alt={art.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/artworks/artwork-1.svg';
                      }}
                    />
                    <span className="badge badge-auction artwork-badge-floating">Live Auction</span>
                  </div>

                  <div className="artwork-body">
                    <div className="artwork-meta-row">
                      <span className="artwork-category">{art.category}</span>
                      <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700 }}>
                        ⏱ Closes Soon
                      </span>
                    </div>

                    <h3 className="artwork-title">
                      <Link to={`/artwork/${art.id}`}>{art.name}</Link>
                    </h3>

                    <p className="artwork-artist">
                      by <Link to={`/artists?artist=${encodeURIComponent(art.artist)}`}>{art.artist}</Link>
                    </p>

                    <div style={{ backgroundColor: 'var(--surface-alt)', padding: '12px', borderRadius: '8px', margin: '12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Current Bid:</span>
                        <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
                          {formatCurrency(currentHighest)}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Top Bidder:</span>
                        <span>{art.currentBidder || 'None yet'}</span>
                      </div>
                    </div>

                    <form onSubmit={(e) => handleQuickBid(e, art)} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={`Min ${minNextBid}`}
                        min={minNextBid}
                        step="500"
                        value={bidInputs[art.id] || ''}
                        onChange={(e) => handleBidInputChange(art.id, e.target.value)}
                        style={{ padding: '8px 10px', fontSize: '0.88rem' }}
                        required
                      />
                      <button type="submit" className="btn btn-sm btn-accent" style={{ whiteSpace: 'nowrap' }}>
                        Bid
                      </button>
                    </form>

                    <Link to={`/artwork/${art.id}`} className="btn btn-sm btn-outline btn-block">
                      View Auction Lot
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* My Bidding Activity Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>My Bidding Activity</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time log of the bids you have placed across live auctions.
            </p>
          </div>

          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <p>Please log in to track your personal auction bids and status.</p>
              <Link to="/login" className="btn btn-sm btn-primary" style={{ marginTop: '12px' }}>
                Sign In to View Bids
              </Link>
            </div>
          ) : userBids.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              You haven't placed any bids yet. Join a live auction lot above!
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Bid ID</th>
                    <th>Artwork Name</th>
                    <th>Your Bid Amount</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {userBids.map((b) => (
                    <tr key={b.id}>
                      <td>#BID-{b.id}</td>
                      <td>
                        <Link to={`/artwork/${b.artworkId}`} style={{ fontWeight: 600 }}>
                          {b.artworkName}
                        </Link>
                      </td>
                      <td>
                        <strong>{formatCurrency(b.bidAmount)}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            b.status === 'Leading' ? 'badge-sale' : 'badge-danger'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{b.date}</td>
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

