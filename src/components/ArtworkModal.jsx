import React, { useState, useEffect } from 'react';
import { useGallery } from '../context/GalleryContext';

export default function ArtworkModal({ artwork, onClose, onSave, isArtistRole = false, defaultArtistName = '' }) {
  const { categories } = useGallery();

  const [formData, setFormData] = useState({
    name: '',
    artist: defaultArtistName || '',
    category: 'Painting',
    type: 'For Sale',
    price: '',
    description: '',
    image: '/images/artworks/artwork-1.svg',
    featured: false
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (artwork) {
      setFormData({
        name: artwork.name || '',
        artist: artwork.artist || defaultArtistName || '',
        category: artwork.category || 'Painting',
        type: artwork.type || 'For Sale',
        price: artwork.price || '',
        description: artwork.description || '',
        image: artwork.image || '/images/artworks/artwork-1.svg',
        featured: Boolean(artwork.featured)
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        artist: defaultArtistName || prev.artist || ''
      }));
    }
  }, [artwork, defaultArtistName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide an artwork title.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Please provide a valid price greater than zero.');
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price)
    });
  };

  const imagePresets = [
    { label: 'Artwork 1 (Landscape)', url: '/images/artworks/artwork-1.svg' },
    { label: 'Artwork 2 (Cyberpunk Digital)', url: '/images/artworks/artwork-2.svg' },
    { label: 'Artwork 3 (Wildlife Photo)', url: '/images/artworks/artwork-3.svg' },
    { label: 'Artwork 4 (Graphite Stallion)', url: '/images/artworks/artwork-4.svg' },
    { label: 'Artwork 5 (Lady in Saffron)', url: '/images/artworks/artwork-5.svg' },
    { label: 'Artwork 6 (Ocean Swell)', url: '/images/artworks/artwork-6.svg' },
    { label: 'Artwork 7 (Geometric Abstract)', url: '/images/artworks/artwork-7.svg' },
    { label: 'Artwork 8 (Bronze Sculpture)', url: '/images/artworks/artwork-8.svg' },
    { label: 'Artwork 9 (Midnight Jazz)', url: '/images/artworks/artwork-9.svg' },
    { label: 'Artwork 10 (Wood Craftsman)', url: '/images/artworks/artwork-10.svg' },
    { label: 'Artwork 11 (Metropolis Dawn)', url: '/images/artworks/artwork-11.svg' },
    { label: 'Artwork 12 (Marble Flora)', url: '/images/artworks/artwork-12.svg' }
  ];

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            {artwork ? 'Edit Artwork Details' : 'Upload New Artwork'}
          </h3>
          <button className="modal-close-btn" onClick={onClose} type="button">
            &times;
          </button>
        </div>

        {error && <div className="form-error show" style={{ marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="artName">Artwork Title *</label>
            <input
              type="text"
              id="artName"
              name="name"
              className="form-control"
              placeholder="e.g. Whispers of Eternity"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="artCategory">Category *</label>
              <select
                id="artCategory"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="artArtist">Artist Name *</label>
              <input
                type="text"
                id="artArtist"
                name="artist"
                className="form-control"
                placeholder="Artist name"
                value={formData.artist}
                onChange={handleChange}
                disabled={isArtistRole}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="artType">Listing Type *</label>
              <select
                id="artType"
                name="type"
                className="form-control"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="For Sale">For Sale (Direct Purchase)</option>
                <option value="Auction">Auction (Live Bidding)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="artPrice">
                {formData.type === 'Auction' ? 'Starting Bid (₹) *' : 'Listing Price (₹) *'}
              </label>
              <input
                type="number"
                id="artPrice"
                name="price"
                className="form-control"
                placeholder="e.g. 15000"
                min="500"
                step="100"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="artPreset">Choose Artwork Artwork Graphic</label>
            <select
              id="artPreset"
              className="form-control"
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
            >
              {imagePresets.map((p, idx) => (
                <option key={idx} value={p.url}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="artDescription">Artwork Description / Critique</label>
            <textarea
              id="artDescription"
              name="description"
              className="form-control"
              rows="3"
              placeholder="Describe the medium, inspiration, palette, and technique..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {!isArtistRole && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="artFeatured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="artFeatured" style={{ marginBottom: 0, cursor: 'pointer' }}>
                Feature this artwork on the Homepage
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn btn-outline btn-block" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn btn-accent btn-block" type="submit">
              {artwork ? 'Save Changes' : 'Publish Artwork'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

