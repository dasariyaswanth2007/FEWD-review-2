import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import ArtworkCard from '../components/ArtworkCard';

export default function ArtistProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { artworks, usersList } = useGallery();

  const selectedArtistName = searchParams.get('artist') || 'Elena Vance';

  // Find artist user or create fallback profile
  const artistUser = usersList.find(
    (u) => u.name && u.name.toLowerCase() === selectedArtistName.toLowerCase()
  ) || {
    name: selectedArtistName,
    specialization: 'Fine Art & Contemporary Painting',
    bio: 'An accomplished visual artist focusing on the intersection of natural light, emotive textures, and modern perspectives.',
    avatar: '/images/avatar-artist.svg'
  };

  const artistArtworks = artworks.filter(
    (a) => a.artist && a.artist.toLowerCase() === selectedArtistName.toLowerCase()
  );

  const allArtists = usersList.filter((u) => (u.role || '').toLowerCase() === 'artist');

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <Link to="/">Home</Link> &gt; <Link to="/artworks">Gallery</Link> &gt;{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Artist Portfolio</span>
        </div>

        {/* Artist Switcher Quick Links */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            View Featured Artists:
          </span>
          {allArtists.map((artist) => (
            <button
              key={artist.id}
              className={`btn btn-sm ${
                artist.name.toLowerCase() === selectedArtistName.toLowerCase()
                  ? 'btn-accent'
                  : 'btn-outline'
              }`}
              onClick={() => setSearchParams({ artist: artist.name })}
              type="button"
            >
              {artist.name} ({artist.specialization?.split('&')[0] || 'Artist'})
            </button>
          ))}
        </div>

        {/* Profile Header Box */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            marginBottom: '40px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={artistUser.avatar || '/images/avatar-artist.svg'}
              alt={artistUser.name}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--accent-light)'
              }}
              onError={(e) => {
                e.currentTarget.src = '/images/avatar-artist.svg';
              }}
            />
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{artistUser.name}</h1>
                <span className="role-tag role-artist">Verified Artist</span>
              </div>
              <p style={{ color: 'var(--accent)', fontWeight: 600, margin: '4px 0 10px' }}>
                {artistUser.specialization || 'Contemporary Fine Artist'}
              </p>
              <p style={{ color: 'var(--text-muted)', maxWidth: '680px', lineHeight: 1.6 }}>
                {artistUser.bio || 'Creating original artworks with deep expression and technique.'}
              </p>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                <div>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>
                    {artistArtworks.length}
                  </strong>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Exhibited Artworks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exhibition Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Exhibition by {artistUser.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Explore available original creations, prints, and live auction lots from this verified artist.
          </p>
        </div>

        {artistArtworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎨</div>
            <h3>No Artworks Listed</h3>
            <p>This artist has not published any artworks in the catalog yet.</p>
          </div>
        ) : (
          <div className="artwork-grid">
            {artistArtworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

