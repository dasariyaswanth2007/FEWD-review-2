import React from 'react';
import { formatCurrency } from '../utils/storage';

export default function BuyModal({ artwork, onClose, onConfirm }) {
  if (!artwork) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Confirm Artwork Purchase</h3>
          <button className="modal-close-btn" onClick={onClose} type="button">
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', gap: '18px', marginBottom: '20px' }}>
          <img
            src={artwork.image}
            alt={artwork.name}
            style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = '/images/artworks/artwork-1.svg';
            }}
          />
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{artwork.name}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>by {artwork.artist}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Category: {artwork.category}
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--surface-alt)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Artwork Price:</span>
            <strong>{formatCurrency(artwork.price)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-muted)' }}>
            <span>Gallery Delivery &amp; Insurance:</span>
            <strong style={{ color: 'var(--success)' }}>FREE</strong>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.1rem',
              fontWeight: 800
            }}
          >
            <span>Total Payable:</span>
            <span style={{ color: 'var(--primary)' }}>{formatCurrency(artwork.price)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline btn-block" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn btn-accent btn-block" onClick={onConfirm} type="button">
            Yes, Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

