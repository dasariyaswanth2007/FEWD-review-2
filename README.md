# Online Art Gallery — ArtLoom (React Edition)

[![Netlify Status](https://api.netlify.com/api/v1/badges/e21fde44-c23a-4d6b-afdc-4f2e528d6af1/deploy-status)](https://app.netlify.com/projects/prismatic-malabi-08328e/deploys)
[![Live Site](https://img.shields.io/badge/Netlify-Live_Demo-00C7B7?style=flat&logo=netlify&logoColor=white)](https://prismatic-malabi-08328e.netlify.app)

**SDC Project Review-2 | Frontend Web Development with React**

🌐 **Live URL**: [https://prismatic-malabi-08328e.netlify.app](https://prismatic-malabi-08328e.netlify.app)

A complete, modern Single Page Application (SPA) built using **React 18+**, **React Router DOM**, **Context API**, and **CSS3 Grid & Flexbox**. Converted from the Review-1 vanilla implementation to an enterprise-grade component architecture while preserving 100% of the original feature set, local data persistence schema, and responsive UI.

---

## 🚀 Key Highlights & Conversion Overview

* **React 18+ Component Architecture**: Modularized into reusable components (`Navbar`, `Footer`, `ArtworkCard`, `BuyModal`, `ArtworkModal`, etc.).
* **Declarative Client-Side Routing (React Router v6+)**: Seamless page transitions without browser reloads across 14 distinct views, with full support for backward-compatible `.html` URL aliases.
* **Centralized State Management (React Context API)**:
  * `AuthContext`: Authentication, session persistence, role-based protection (Admin, Artist, Collector), and demo credentials quick-fill.
  * `GalleryContext`: Artwork catalog CRUD, category distribution, order transactions, real-time auction bidding, user reviews, and wishlist favorites.
  * `ToastContext`: Reactive toast notifications with animated status feedback.
* **Persistent LocalStorage Layer**: 100% backward-compatible schema (`users`, `artworks`, `categories`, `purchases`, `favorites`, `bids`, `reviews`).
* **Zero CSS Framework Bloat**: Pure CSS3 variables, Grid, and Flexbox layouts retained from the design system.
* **Offline SVG Graphics**: 12 high-resolution vector artwork files and avatars bundled locally in `/public/images/`.
* **Legacy Preservation**: The original Review-1 Vanilla HTML/CSS/JS version is safely preserved in the `vanilla-version/` directory.

---

## 📁 React Project Structure

```text
front_end_review_2/
├── index.html                   # Vite entry HTML
├── vite.config.js               # Vite bundler configuration (Port 3000)
├── package.json                 # React 18, React-DOM, React Router & Vite
│
├── public/
│   └── images/                  # Static SVG assets & 12 offline artworks
│       ├── logo.svg
│       ├── avatar-admin.svg
│       ├── avatar-artist.svg
│       ├── avatar-user.svg
│       └── artworks/ (artwork-1.svg through artwork-12.svg)
│
├── src/
│   ├── main.jsx                 # Application root & context providers setup
│   ├── App.jsx                  # React Router declarative route table & ScrollToTop
│   ├── index.css                # Unified CSS3 Design System (Grid, Flexbox, Tokens)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication & Role Guard state
│   │   ├── GalleryContext.jsx   # Catalog, Bidding, Orders & Reviews state
│   │   └── ToastContext.jsx     # Floating toast feedback notifications
│   │
│   ├── components/
│   │   ├── Navbar.jsx           # Responsive navigation with role-aware badge
│   │   ├── Footer.jsx           # Global footer with navigation & demo notes
│   │   ├── ArtworkCard.jsx      # Reusable artwork card with wishlist toggle
│   │   ├── BuyModal.jsx         # Direct artwork purchase checkout modal
│   │   └── ArtworkModal.jsx     # Add / Edit artwork dialog (Admin & Artist)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx         # Hero, categories, featured artworks & auction preview
│   │   ├── GalleryPage.jsx      # Real-time search, category pills & dynamic sorting
│   │   ├── ArtworkDetailsPage.jsx # Details, buy flow, live bidding & review submit
│   │   ├── ArtistProfilePage.jsx  # Artist biography, verification & exhibition showcase
│   │   ├── AuctionsPage.jsx     # Live auction bidding room & personal bids log
│   │   ├── ReviewsPage.jsx      # Community critiques & 1-5 star submission form
│   │   ├── AboutPage.jsx        # Project objectives, architecture & tech stack
│   │   ├── LoginPage.jsx        # Role selection, quick-fill buttons & admin code
│   │   ├── SignupPage.jsx       # Registration with validation
│   │   ├── AdminDashboardPage.jsx # KPI cards & 6 management tabs (CRUD, users, logs)
│   │   ├── ArtistDashboardPage.jsx# Artist studio stats & portfolio CRUD
│   │   ├── UserDashboardPage.jsx# Collector workspace stats & recent orders
│   │   ├── FavoritesPage.jsx    # Collector wishlist gallery
│   │   └── PurchasesPage.jsx    # Order receipts & certificate invoices
│   │
│   └── utils/
│       └── storage.js           # LocalStorage helpers & sample data initializer
│
├── vanilla-version/             # Complete backup of Review-1 Vanilla HTML/CSS/JS
└── README.md                    # Project documentation & review guide
```

---

## 🛠️ How to Run the React Project

### Prerequisites
* **Node.js**: v18+ or v20+ recommended (`node -v`)
* **npm**: v9+ (`npm -v`)

### Steps to Run

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or the URL displayed in the terminal) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🔑 Pre-Configured Test Credentials

On the `/login` page, you can type these credentials manually or click the **⚡ Quick-Fill Demo Credentials** buttons:

| Role | Email Address | Password | Admin Security Code | Default Landing View |
|---|---|---|---|---|
| **Admin** | `admin@artgallery.com` | `admin123` | `ARTLOOM-ADMIN-2026` | `/admin-dashboard` |
| **Buyer / User** | `user@artgallery.com` | `user123` | *Not Required* | `/user-dashboard` |
| **Artist** | `artist@artgallery.com` | `artist123` | *Not Required* | `/artist-dashboard` |

---

## 🎯 Review-2 Demonstration Flow for Evaluators

1. **Homepage (`/`)**:
   * Inspect the responsive hero banner, curated statistics, 8 category cards, and featured artworks.
   * Notice instant reactive state changes without full page reloads.

2. **Gallery (`/artworks`)**:
   * Filter in real time using the search bar (e.g., search "Elena", "Landscape", or "Digital").
   * Filter by category pills (Painting, Digital Art, Photography, Sculpture, etc.).
   * Sort by Price (Low to High, High to Low), Alphabetical, or Newest Arrivals.

3. **Artwork Details & Purchase Flow (`/artwork/:id`)**:
   * View high-resolution SVG artwork with full metadata.
   * Toggle the heart icon to save to Wishlist (`/favorites`).
   * Click **Buy Now** to open the purchase confirmation modal; complete simulated purchase and inspect the order receipt on `/purchases`.
   * Test the interactive 1–5 star rating picker and submit a community review.

4. **Live Auction Hub (`/auctions`)**:
   * Place a validated bid on an active auction lot (e.g., Neon Cyber Odyssey).
   * Verify that outbid validation prevents bids below the minimum increment (+₹500).
   * Check your personal bid history table showing current "Leading" status.

5. **Role Dashboards**:
   * **Admin Dashboard (`/admin-dashboard`)**: Switch between the 6 tabs (Manage Artworks CRUD, User Moderation, Categories, Purchases Log, Auctions Log, Reviews Moderation). Add or edit an artwork via the modal.
   * **Artist Dashboard (`/artist-dashboard`)**: Upload a new artwork, edit pricing, and visit the public profile page (`/artists`).
   * **Collector Dashboard (`/user-dashboard`)**: View active bids, favorite count, and recent purchases.

---

## 📜 Academic Integrity Note

* All components, hooks, routing, and state architectures were developed specifically for **SDC Project Review-2**.
* The original Review-1 vanilla implementation is preserved untouched in `vanilla-version/` for historical evaluator reference.
