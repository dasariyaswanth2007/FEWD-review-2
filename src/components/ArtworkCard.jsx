import React from 'react';
import { Link } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { formatCurrency } from '../utils/storage';

export default function ArtworkCard({ artwork }) {
  const { isArtworkFavorited, toggleFavorite } = useGallery();
  const isFav = isArtworkFavorited(artwork.id);

  const typeBadgeClass = artwork.type === 'Auction' ? 'badge-auction' : 'badge-sale';
  const priceDisplay = artwork.type === 'Auction' ? (artwork.currentBid || artwork.price) : artwork.price;
  const priceLabel = artwork.type === 'Auction' ? 'Current Bid' : 'Price';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(artwork.id);
  };

  return (
    <div className="artwork-card" data-id={artwork.id} data-category={artwork.category}>
      <div className="artwork-image-wrap">
        <img
          src={artwork.image}
          alt={artwork.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/artworks/artwork-1.svg';
          }}
        />
        <span className={`badge ${typeBadgeClass} artwork-badge-floating`}>{artwork.type}</span>
        <button
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          type="button"
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      <div className="artwork-body">
        <div className="artwork-meta-row">
          <span className="artwork-category">{artwork.category}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {artwork.type === 'Auction' ? 'Live Auction' : 'Direct Sale'}
          </span>
        </div>

        <h3 className="artwork-title">
          <Link to={`/artwork/${artwork.id}`}>{artwork.name}</Link>
        </h3>

        <p className="artwork-artist">
          by <Link to={`/artists?artist=${encodeURIComponent(artwork.artist)}`}>{artwork.artist}</Link>
        </p>

        <div className="artwork-footer-row">
          <div>
            <span className="artwork-price-label">{priceLabel}</span>
            <span className="artwork-price-val">{formatCurrency(priceDisplay)}</span>
          </div>
          <Link to={`/artwork/${artwork.id}`} className="btn btn-sm btn-outline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

