import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ReviewsPage() {
  const { artworks, reviews, addReview } = useGallery();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedArtworkId, setSelectedArtworkId] = useState(artworks[0]?.id || 1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to submit a review', 'warning');
      return;
    }
    if (!comment.trim()) {
      showToast('Please provide a comment for your review', 'error');
      return;
    }

    const res = addReview({
      artworkId: Number(selectedArtworkId),
      rating,
      comment
    });

    if (res.success) {
      setComment('');
    }
  };

  const renderStars = (starCount) => {
    const count = Math.round(Number(starCount || 5));
    return (
      <span className="star-rating" style={{ color: '#f59e0b', fontSize: '1.15rem' }}>
        {'★'.repeat(count)}
        {'☆'.repeat(5 - count)}
      </span>
    );
  };

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="section-subtitle">Community Feedback</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Collector Reviews &amp; Critiques</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Genuine feedback and ratings shared by art collectors, critics, and community members.
          </p>
        </div>

        {/* Submit Review Card */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '40px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
            Write an Artwork Review
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label htmlFor="reviewArtSelect">Select Artwork *</label>
                <select
                  id="reviewArtSelect"
                  className="form-control"
                  value={selectedArtworkId}
                  onChange={(e) => setSelectedArtworkId(e.target.value)}
                  required
                >
                  {artworks.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — by {a.artist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Star Rating (1 to 5) *</label>
                <div style={{ display: 'flex', gap: '8px', fontSize: '1.6rem', cursor: 'pointer', paddingTop: '4px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      onClick={() => setRating(s)}
                      style={{
                        color: s <= rating ? '#f59e0b' : '#cbd5e1',
                        transition: 'color 0.15s',
                        userSelect: 'none'
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '8px' }}>
                    ({rating} / 5)
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reviewBody">Your Critique &amp; Impression *</label>
              <textarea
                id="reviewBody"
                className="form-control"
                rows="3"
                placeholder="Share your perspective on the emotional resonance, color harmony, and technique..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Post Community Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
            All Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h3>No Reviews Yet</h3>
              <p>Be the first collector to post a review and critique an artwork!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {reviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{r.userName}</strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.date}</div>
                    </div>
                    <div>{renderStars(r.rating)}</div>
                  </div>

                  <div style={{ margin: '10px 0 12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Artwork: </span>
                    <Link
                      to={`/artwork/${r.artworkId}`}
                      style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.92rem' }}
                    >
                      {r.artworkName}
                    </Link>
                  </div>

                  <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

