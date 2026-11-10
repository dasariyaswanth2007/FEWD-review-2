import React, { createContext, useContext, useState } from 'react';
import { getData, setData, getNextId } from '../utils/storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const GalleryContext = createContext(null);

export function GalleryProvider({ children }) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [artworks, setArtworks] = useState(() => getData('artworks', []));
  const [categories, setCategories] = useState(() => getData('categories', []));
  const [purchases, setPurchases] = useState(() => getData('purchases', []));
  const [favorites, setFavorites] = useState(() => getData('favorites', {}));
  const [bids, setBids] = useState(() => getData('bids', []));
  const [reviews, setReviews] = useState(() => getData('reviews', []));
  const [usersList, setUsersList] = useState(() => getData('users', []));

  // Helper to check favorite
  const isArtworkFavorited = (artworkId) => {
    if (!currentUser) return false;
    const userFavs = favorites[currentUser.id] || [];
    return userFavs.includes(Number(artworkId));
  };

  // Toggle Favorite
  const toggleFavorite = (artworkId) => {
    if (!currentUser) {
      showToast('Please login to save favorite artworks', 'warning');
      return false;
    }

    const artIdNum = Number(artworkId);
    const updatedFavs = { ...favorites };
    const userFavs = [...(updatedFavs[currentUser.id] || [])];
    const index = userFavs.indexOf(artIdNum);

    if (index > -1) {
      userFavs.splice(index, 1);
      updatedFavs[currentUser.id] = userFavs;
      setFavorites(updatedFavs);
      setData('favorites', updatedFavs);
      showToast('Removed from favorites', 'info');
      return false;
    } else {
      userFavs.push(artIdNum);
      updatedFavs[currentUser.id] = userFavs;
      setFavorites(updatedFavs);
      setData('favorites', updatedFavs);
      showToast('Added to your favorites!', 'success');
      return true;
    }
  };

  // Add Artwork
  const addArtwork = (artworkData) => {
    const newArt = {
      id: getNextId(artworks),
      name: artworkData.name,
      artist: artworkData.artist || (currentUser ? currentUser.name : 'Unknown Artist'),
      artistId: artworkData.artistId || (currentUser ? currentUser.id : null),
      category: artworkData.category || 'Painting',
      description: artworkData.description || '',
      price: Number(artworkData.price) || 1000,
      startingPrice: artworkData.type === 'Auction' ? Number(artworkData.price) : undefined,
      currentBid: artworkData.type === 'Auction' ? Number(artworkData.price) : undefined,
      currentBidder: artworkData.type === 'Auction' ? 'None yet' : undefined,
      type: artworkData.type || 'For Sale',
      image: artworkData.image || '/images/artworks/artwork-1.svg',
      featured: artworkData.featured ?? false,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const updated = [newArt, ...artworks];
    setArtworks(updated);
    setData('artworks', updated);
    showToast(`Artwork "${newArt.name}" created successfully!`, 'success');
    return newArt;
  };

  // Update Artwork
  const updateArtwork = (artworkId, updatedFields) => {
    const updated = artworks.map((art) => {
      if (art.id === Number(artworkId)) {
        return {
          ...art,
          ...updatedFields,
          price: Number(updatedFields.price ?? art.price)
        };
      }
      return art;
    });

    setArtworks(updated);
    setData('artworks', updated);
    showToast('Artwork updated successfully!', 'success');
    return true;
  };

  // Delete Artwork
  const deleteArtwork = (artworkId) => {
    const updated = artworks.filter((art) => art.id !== Number(artworkId));
    setArtworks(updated);
    setData('artworks', updated);
    showToast(`Artwork #${artworkId} removed from catalog.`, 'info');
    return true;
  };

  // Purchase Artwork
  const confirmPurchase = (artworkId, paymentMethod = 'Online Card (Simulated)') => {
    if (!currentUser) {
      showToast('Please login to purchase artwork', 'warning');
      return { success: false, error: 'Not logged in' };
    }

    const art = artworks.find((a) => a.id === Number(artworkId));
    if (!art) {
      showToast('Artwork not found', 'error');
      return { success: false, error: 'Artwork not found' };
    }

    const newPurchase = {
      id: getNextId(purchases),
      userId: currentUser.id,
      userName: currentUser.name,
      artworkId: art.id,
      artworkName: art.name,
      artist: art.artist,
      price: art.price,
      date: new Date().toISOString().slice(0, 10),
      image: art.image,
      status: 'Completed',
      paymentMethod
    };

    const updatedPurchases = [newPurchase, ...purchases];
    setPurchases(updatedPurchases);
    setData('purchases', updatedPurchases);
    showToast(`Purchase confirmed! "${art.name}" is now in your collection.`, 'success');
    return { success: true, purchase: newPurchase };
  };

  // Place Bid
  const placeBid = (artworkId, bidAmount) => {
    if (!currentUser) {
      showToast('Please login to place bids', 'warning');
      return { success: false, error: 'Not logged in' };
    }

    const art = artworks.find((a) => a.id === Number(artworkId));
    if (!art) {
      showToast('Artwork not found', 'error');
      return { success: false, error: 'Artwork not found' };
    }

    const numBid = Number(bidAmount);
    const currentHighest = Number(art.currentBid || art.price);

    if (!numBid || isNaN(numBid) || numBid <= currentHighest) {
      const err = `Your bid must be higher than the current bid of ₹${currentHighest.toLocaleString('en-IN')}`;
      showToast(err, 'error');
      return { success: false, error: err };
    }

    // Update artwork
    const updatedArtworks = artworks.map((a) => {
      if (a.id === art.id) {
        return {
          ...a,
          currentBid: numBid,
          currentBidder: currentUser.name,
          bidsCount: (a.bidsCount || 0) + 1
        };
      }
      return a;
    });
    setArtworks(updatedArtworks);
    setData('artworks', updatedArtworks);

    // Record bid in bids history
    const newBidRecord = {
      id: getNextId(bids),
      artworkId: art.id,
      artworkName: art.name,
      userId: currentUser.id,
      userName: currentUser.name,
      bidAmount: numBid,
      date: new Date().toLocaleString(),
      status: 'Leading'
    };

    // Mark previous bids on this lot as outbid
    const updatedBids = bids.map((b) => {
      if (b.artworkId === art.id) {
        return { ...b, status: 'Outbid' };
      }
      return b;
    });
    const finalBids = [newBidRecord, ...updatedBids];
    setBids(finalBids);
    setData('bids', finalBids);

    showToast(`Bid placed of ₹${numBid.toLocaleString('en-IN')}! You are currently the highest bidder.`, 'success');
    return { success: true };
  };

  // End Auction
  const endAuction = (artworkId) => {
    const updated = artworks.map((a) => {
      if (a.id === Number(artworkId)) {
        return {
          ...a,
          status: 'closed',
          type: 'Sold via Auction'
        };
      }
      return a;
    });
    setArtworks(updated);
    setData('artworks', updated);
    showToast(`Auction for #${artworkId} has been closed.`, 'info');
  };

  // Add Review
  const addReview = ({ artworkId, rating, comment }) => {
    if (!currentUser) {
      showToast('Please login to leave a review', 'warning');
      return { success: false, error: 'Not logged in' };
    }

    const art = artworks.find((a) => a.id === Number(artworkId));
    const artName = art ? art.name : 'Curated Artwork';

    const newReview = {
      id: getNextId(reviews),
      artworkId: Number(artworkId),
      artworkName: artName,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: Number(rating) || 5,
      comment: String(comment || '').trim(),
      date: new Date().toISOString().slice(0, 10)
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    setData('reviews', updated);
    showToast('Your review and rating have been posted!', 'success');
    return { success: true, review: newReview };
  };

  // Delete Review
  const deleteReview = (reviewId) => {
    const updated = reviews.filter((r) => r.id !== Number(reviewId));
    setReviews(updated);
    setData('reviews', updated);
    showToast('Review removed.', 'info');
  };

  // Delete User
  const deleteUser = (userId) => {
    const users = getData('users', []);
    const updated = users.filter((u) => u.id !== Number(userId));
    setUsersList(updated);
    setData('users', updated);
    showToast(`User #${userId} deleted.`, 'info');
  };

  return (
    <GalleryContext.Provider
      value={{
        artworks,
        categories,
        purchases,
        favorites,
        bids,
        reviews,
        usersList,
        isArtworkFavorited,
        toggleFavorite,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        confirmPurchase,
        placeBid,
        endAuction,
        addReview,
        deleteReview,
        deleteUser
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}

