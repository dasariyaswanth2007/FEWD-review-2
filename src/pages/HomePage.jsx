import React from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import ArtworkCard from '../components/ArtworkCard';

export default function HomePage() {
  const { artworks, categories } = useGallery();

  const featuredArtworks = artworks.filter((a) => a.featured).slice(0, 6);
  const heroArtwork = artworks.find((a) => a.id === 1) || artworks[0];

  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="section-subtitle" style={{ color: '#f59e0b' }}>
              Welcome to ArtLoom Gallery
            </div>
            <h1>
              Discover Art. <span>Inspire Creativity.</span>
            </h1>
            <p>
              Explore unique artworks from talented independent artists worldwide. Discover original paintings,
              digital renders, fine sculptures, and participate in curated live auctions.
            </p>
            <div className="hero-actions">
              <Link to="/artworks" className="btn btn-lg btn-accent">
                Explore Gallery
              </Link>
              <Link
                to="/signup"
                className="btn btn-lg btn-outline"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Become an Artist
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <h4>{artworks.length}+</h4>
                <p>Curated Artworks</p>
              </div>
              <div className="hero-stat-item">
                <h4>{categories.length}</h4>
                <p>Diverse Categories</p>
              </div>
              <div className="hero-stat-item">
                <h4>100%</h4>
                <p>Verified Artists</p>
              </div>
            </div>
          </div>

          {heroArtwork && (
            <div className="hero-image-card">
              <img
                src={heroArtwork.image}
                alt={`Featured Masterpiece: ${heroArtwork.name}`}
                onError={(e) => {
                  e.currentTarget.src = '/images/artworks/artwork-1.svg';
                }}
              />
              <div className="hero-card-meta">
                <div>
                  <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>{heroArtwork.name}</strong>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 0 }}>
                    {heroArtwork.artist} • {heroArtwork.category}
                  </p>
                </div>
                <Link
                  to={`/artwork/${heroArtwork.id}`}
                  className="btn btn-sm btn-outline"
                  style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  View Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Artistic Expressions</span>
            <h2 className="section-title">Explore Categories</h2>
            <p className="section-desc">
              From classical Renaissance-style oil paintings to cutting-edge 3D generative digital art.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/artworks?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div className="category-icon-box">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Handpicked Selections</span>
            <h2 className="section-title">Featured Artworks</h2>
            <p className="section-desc">
              Discover the season's most praised and highly sought-after original creations.
            </p>
          </div>

          <div className="artwork-grid">
            {featuredArtworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/artworks" className="btn btn-lg btn-primary">
              Browse All Artworks
            </Link>
          </div>
        </div>
      </section>

      {/* Live Auction Preview Section */}
      <section
        className="section-padding"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          color: 'var(--text-inverse)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '30px'
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <span className="badge badge-auction" style={{ marginBottom: '12px' }}>
                Live Bidding Room
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
                Participate in Exclusive Art Auctions
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>
                Place competitive bids on rare, one-of-a-kind artworks directly from celebrated contemporary artists.
                Track current highest bids in real time.
              </p>
            </div>
            <div>
              <Link to="/auctions" className="btn btn-lg btn-accent">
                Enter Auction Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

