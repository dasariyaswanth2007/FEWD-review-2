import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import ArtworkCard from '../components/ArtworkCard';

export default function GalleryPage() {
  const { artworks, categories } = useGallery();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('default');

  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(
        (art) => art.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (art) =>
          art.name.toLowerCase().includes(q) ||
          art.artist.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          (art.description && art.description.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.currentBid || a.price) - (b.currentBid || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.currentBid || b.price) - (a.currentBid || a.price));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [artworks, selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <main className="main-content">
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Page Header */}
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
            <span className="section-subtitle">Exhibition Catalog</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Curated Artworks</h1>
          </div>
          <div>
            <span className="badge badge-category" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {filteredArtworks.length} Artworks Found
            </span>
          </div>
        </div>

        {/* Controls: Search, Category Filters, & Sorting */}
        <div className="gallery-controls">
          <div className="search-sort-row">
            {/* Real-time Search Input */}
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by artwork name, artist, or category (e.g. 'Landscape', 'Elena')..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Sort Select Dropdown */}
            <div style={{ minWidth: '200px' }}>
              <select
                className="form-control"
                style={{ cursor: 'pointer' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Featured / Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Artwork Name: A to Z</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="filter-pills-row">
            <button
              className={`filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('All')}
              type="button"
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`filter-pill ${selectedCategory === c.name ? 'active' : ''}`}
                onClick={() => handleCategoryChange(c.name)}
                type="button"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Artwork Cards Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h3>No Artworks Found</h3>
            <p>We couldn't find any artworks matching your selected category or search filters.</p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSearchParams({});
              }}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="artwork-grid">
            {filteredArtworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

