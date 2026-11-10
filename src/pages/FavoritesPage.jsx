import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import ArtworkCard from '../components/ArtworkCard';

export default function FavoritesPage() {
  const { currentUser } = useAuth();
  const { artworks, favorites } = useGallery();

  const userFavIds = currentUser ? favorites[currentUser.id] || [] : [];
  const favoriteArtworks = artworks.filter((a) => userFavIds.includes(a.id));

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <span className="section-subtitle">Personal Wishlist</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Saved Favorites</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Curated artworks you have shortlisted for observation, bidding, or acquisition.
          </p>
        </div>

        {!currentUser ? (
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>Please Log In</h3>
            <p>You must be logged in to view and manage your favorite artworks.</p>
            <Link to="/login" className="btn btn-primary">
              Login Now
            </Link>
          </div>
        ) : favoriteArtworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>No Favorite Artworks Saved</h3>
            <p>You haven't added any artworks to your wishlist yet. Explore the gallery and click the heart icon!</p>
            <Link to="/artworks" className="btn btn-primary">
              Browse Curated Gallery
            </Link>
          </div>
        ) : (
          <div className="artwork-grid">
            {favoriteArtworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

