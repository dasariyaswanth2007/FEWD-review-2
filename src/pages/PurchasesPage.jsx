import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import { formatCurrency } from '../utils/storage';

export default function PurchasesPage() {
  const { currentUser } = useAuth();
  const { purchases } = useGallery();

  const userPurchases = currentUser
    ? purchases.filter((p) => p.userId === currentUser.id)
    : [];

  const totalSpent = userPurchases.reduce((sum, p) => sum + Number(p.price || 0), 0);

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <span className="section-subtitle">Acquisitions &amp; Invoices</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Purchase History &amp; Receipts</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Full audit trail of original artwork acquisitions and certificates.
            </p>
          </div>
          {currentUser && userPurchases.length > 0 && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Collection Value:</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                {formatCurrency(totalSpent)}
              </div>
            </div>
          )}
        </div>

        {!currentUser ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>Please Log In</h3>
            <p>You must be logged in to view your acquired artworks and order invoices.</p>
            <Link to="/login" className="btn btn-primary">
              Login Now
            </Link>
          </div>
        ) : userPurchases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>No Purchases Made Yet</h3>
            <p>You have not acquired any artworks yet. Browse the curated gallery to start your fine art collection!</p>
            <Link to="/artworks" className="btn btn-primary">
              Discover Fine Art
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {userPurchases.map((p) => (
              <div
                key={p.id}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img
                  src={p.image || '/images/artworks/artwork-1.svg'}
                  alt={p.artworkName}
                  style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/artworks/artwork-1.svg';
                  }}
                />

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-sale">Order #ORD-{p.id}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {p.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{p.artworkName}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>by {p.artist}</p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Payment: <strong>{p.paymentMethod || 'Online (Simulated)'}</strong> • Shipping: <strong>Insured White Glove (Included)</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '160px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount Paid</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                    {formatCurrency(p.price)}
                  </div>
                  <span className="badge badge-sale" style={{ fontSize: '0.85rem' }}>
                    {p.status || 'Confirmed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

