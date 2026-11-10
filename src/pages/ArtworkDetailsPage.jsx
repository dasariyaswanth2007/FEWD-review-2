import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/storage';
import BuyModal from '../components/BuyModal';

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const {
    artworks,
    isArtworkFavorited,
    toggleFavorite,
    confirmPurchase,
    placeBid,
    reviews,
    addReview
  } = useGallery();

  const artworkId = Number(id) || 1;
  const artwork = artworks.find((a) => a.id === artworkId);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!artwork) {
    return (
      <main className="main-content">
        <div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}>
          <h2>Artwork Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>
            The requested artwork does not exist or has been removed from the catalog.
          </p>
          <Link to="/artworks" className="btn btn-primary">
            Back to Gallery
          </Link>
        </div>
      </main>
    );
  }

  const isFav = isArtworkFavorited(artwork.id);
  const currentHighest = Number(artwork.currentBid || artwork.price);
  const minNextBid = currentHighest + 500;

  const artworkReviews = reviews.filter((r) => r.artworkId === artwork.id);

  const handleBuyClick = () => {
    if (!currentUser) {
      showToast('Please login to purchase artwork', 'warning');
      navigate('/login');
      return;
    }
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = () => {
    const res = confirmPurchase(artwork.id);
    setShowBuyModal(false);
    if (res.success) {
      navigate('/purchases');
    }
  };

  const handlePlaceBidSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to place bids', 'warning');
      navigate('/login');
      return;
    }

    const val = Number(bidAmount);
    const res = placeBid(artwork.id, val);
    if (res.success) {
      setBidAmount('');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to leave a review', 'warning');
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      showToast('Please write a comment for your review', 'error');
      return;
    }

    const res = addReview({
      artworkId: artwork.id,
      rating: reviewRating,
      comment: reviewComment
    });

    if (res.success) {
      setReviewComment('');
    }
  };

  const renderStars = (rating) => {
    const count = Math.round(Number(rating || 5));
    return (
      <span className="star-rating" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
        {'★'.repeat(count)}
        {'☆'.repeat(5 - count)}
      </span>
    );
  };

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '36px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <Link to="/">Home</Link> &gt; <Link to="/artworks">Gallery</Link> &gt;{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{artwork.name}</span>
        </div>

        {/* Artwork Details Grid */}
        <div className="details-grid">
          <div className="details-image-wrap">
            <img
              src={artwork.image}
              alt={artwork.name}
              onError={(e) => {
                e.currentTarget.src = '/images/artworks/artwork-1.svg';
              }}
            />
          </div>

          <div className="details-info-wrap">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <span className="badge badge-category">{artwork.category}</span>
              <span className={`badge ${artwork.type === 'Auction' ? 'badge-auction' : 'badge-sale'}`}>
                {artwork.type}
              </span>
            </div>

            <h1 className="details-title">{artwork.name}</h1>

            <p className="details-artist">
              Created by{' '}
              <Link to={`/artists?artist=${encodeURIComponent(artwork.artist)}`}>
                {artwork.artist}
              </Link>
            </p>

            <p className="details-description">{artwork.description}</p>

            {/* Pricing / Bidding Section */}
            <div className="details-price-box">
              {artwork.type === 'Auction' ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      marginBottom: '16px'
                    }}
                  >
                    <div>
                      <div className="artwork-price-label">Current Highest Bid</div>
                      <div className="artwork-price-val" style={{ color: 'var(--accent)', fontSize: '2rem' }}>
                        {formatCurrency(artwork.currentBid || artwork.price)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Highest Bidder: <strong>{artwork.currentBidder || 'None yet'}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-auction">Live Bidding</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        Min Next Bid: {formatCurrency(minNextBid)}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handlePlaceBidSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="number"
                      className="form-control"
                      placeholder={`Enter > ${currentHighest}`}
                      min={minNextBid}
                      step="500"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-accent">
                      Place Bid
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="artwork-price-label">Purchase Price</div>
                    <div className="artwork-price-val" style={{ color: 'var(--success)', fontSize: '2rem' }}>
                      {formatCurrency(artwork.price)}
                    </div>
                  </div>
                  <button onClick={handleBuyClick} className="btn btn-lg btn-accent" type="button">
                    Buy Now
                  </button>
                </div>
              )}
            </div>

            <div className="details-actions-row">
              <button
                className={`btn btn-outline ${isFav ? 'active' : ''}`}
                onClick={() => toggleFavorite(artwork.id)}
                type="button"
              >
                {isFav ? '♥ In Favorites' : '♡ Add to Favorites'}
              </button>
              <Link to={`/artists?artist=${encodeURIComponent(artwork.artist)}`} className="btn btn-outline">
                View Artist Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
            marginTop: '40px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Collector Reviews &amp; Ratings</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({artworkReviews.length} Customer Reviews)
              </span>
            </div>
          </div>

          {/* Write Review Form */}
          <div
            style={{
              backgroundColor: 'var(--surface-alt)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              marginBottom: '30px'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>
              Leave Your Review &amp; Star Rating
            </h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>Select Rating (1 to 5 Stars):</label>
                <div style={{ display: 'flex', gap: '8px', fontSize: '1.5rem', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setReviewRating(star)}
                      style={{
                        color: star <= reviewRating ? '#f59e0b' : '#cbd5e1',
                        transition: 'color 0.2s',
                        userSelect: 'none'
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '8px' }}>
                    ({reviewRating} Star{reviewRating > 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="detailsComment">Your Comments &amp; Critique:</label>
                <textarea
                  id="detailsComment"
                  className="form-control"
                  rows="3"
                  placeholder="Share your thoughts on the composition, brushwork, emotional resonance..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          </div>

          {/* List of existing reviews */}
          {artworkReviews.length === 0 ? (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: '8px'
              }}
            >
              No reviews yet for this masterpiece. Be the first to share your appreciation!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {artworkReviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--surface-alt)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{r.userName}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>
                        • {r.date}
                      </span>
                    </div>
                    <div>{renderStars(r.rating)}</div>
                  </div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginTop: '8px' }}>
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showBuyModal && (
        <BuyModal
          artwork={artwork}
          onClose={() => setShowBuyModal(false)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </main>
  );
}

