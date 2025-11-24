# Development Todos

This document tracks all development tasks based on the specification in [01-spec.md](01-spec.md).

---

## Phase 1: Project Setup & Foundation

### 1. Initial Setup
- [x] Initialize Next.js 16+ project with TypeScript
- [x] Configure Tailwind CSS
- [ ] Install and configure Ant Design
- [x] Set up project folder structure
- [x] Configure ESLint and Prettier
- [x] Set up Git repository and .gitignore
- [ ] Create environment variables template (.env.example)

### 2. Firebase Setup
- [x] Create Firebase project
- [x] Enable Firebase Authentication (Email/Password, Google OAuth)
- [x] Set up Firestore Database
- [ ] Configure Firestore security rules (needs review)
- [x] Set up Firebase Storage for product images
- [x] Configure Firebase in Next.js app
- [x] Create Firebase config file
- [ ] Set up Firebase Hosting

### 3. Project Architecture
- [x] Create folder structure:
  - [x] `/app` - Next.js 16 App Router pages
  - [x] `/components` - Reusable components
  - [x] `/lib` - Utilities and helpers
  - [x] `/hooks` - Custom React hooks
  - [x] `/context` - React Context providers
  - [x] `/types` - TypeScript type definitions
  - [x] `/public` - Static assets
  - [x] `/styles` - Global styles
- [x] Set up TypeScript interfaces for data models
- [x] Create utility functions for Firebase operations

---

## Phase 2: Authentication System

### 4. Authentication Components
- [x] Create Login page/component
- [x] Create Registration page/component
- [x] Create Password Reset page/component
- [x] Implement Google OAuth login button
- [x] Create authentication context/provider
- [x] Implement protected route HOC/wrapper
- [ ] Add email verification flow
- [x] Create user profile setup form

### 5. Authentication Logic
- [x] Implement email/password registration
- [x] Implement email/password login
- [x] Implement Google OAuth integration
- [x] Implement logout functionality
- [x] Implement password reset functionality
- [ ] Add email verification
- [x] Create session management
- [x] Add authentication state persistence

---

## Phase 3: Core UI Components

### 6. Layout Components
- [x] Create main layout wrapper
- [x] Implement bottom navigation for mobile
  - [x] Home tab
  - [x] Cart tab with badge counter
  - [x] Favorites tab
  - [x] Account tab
- [ ] Implement sidebar navigation for desktop
- [x] Create responsive navigation logic
- [x] Add active state indicators

### 7. Reusable Components
- [x] Create ProductCard component
- [x] Create Button component (CTA, secondary, etc.)
- [x] Create Input/Form field components
- [x] Create Loading spinner/skeleton
- [x] Create Modal/Dialog component
- [x] Create Toast/Notification component
- [x] Create Image component with lazy loading
- [x] Create Badge component
- [ ] Create Breadcrumb component
- [x] Create Empty state component

---

## Phase 4: Product Catalog

### 8. Product Listing Page (Home)
- [x] Create product listing page layout
- [x] Implement product grid view
- [x] Add search bar component
- [x] Create category filter tabs (All Items, Dress, T-Shirt, Pants)
- [x] Implement advanced filter button/modal
- [x] Add sort dropdown (price, rating, newest)
- [ ] Implement pagination or infinite scroll
- [x] Add loading states
- [x] Implement empty state for no products
- [x] Add favorite/wishlist toggle on product cards

### 9. Product Detail Page
- [x] Create product detail page layout
- [x] Implement image gallery/carousel
- [ ] Add image zoom functionality
- [x] Display product information (name, price, rating, reviews)
- [x] Create size selector component
- [x] Create color selector component
- [x] Implement quantity selector (+/- buttons)
- [x] Add "Add to Cart" button with price display
- [x] Show sale price with strikethrough original price
- [x] Implement expandable description ("Read More...")
- [x] Add wishlist toggle button
- [x] Add back navigation
- [ ] Create "Related Products" section (optional for MVP)

### 10. Product Data Management
- [x] Create Product TypeScript interface/type
- [x] Set up Firestore collection structure for products
- [x] Create product CRUD functions (admin)
- [x] Implement product fetch by ID
- [x] Implement product search/filter logic
- [x] Add product sorting logic
- [x] Create seed data script for testing

---

## Phase 5: Shopping Cart

### 11. Cart Functionality
- [x] Create cart context/state management
- [x] Implement add to cart logic
- [x] Implement remove from cart logic
- [x] Implement update quantity logic
- [x] Calculate subtotal/total
- [x] Persist cart to Firestore (for logged-in users)
- [x] Persist cart to localStorage (for guests)
- [x] Sync cart between localStorage and Firestore on login

### 12. Cart UI
- [x] Create cart page layout
- [x] Display cart items with thumbnails
- [x] Show product variants (size, color)
- [x] Add quantity adjusters for each item
- [x] Implement remove item button
- [x] Show subtotal calculation
- [ ] Add "Save for Later" functionality (optional for MVP)
- [x] Create mini cart indicator (badge on nav)
- [x] Implement empty cart state
- [x] Add "Continue Shopping" button

---

## Phase 6: Wishlist/Favorites

### 13. Wishlist Functionality
- [x] Create wishlist context/state management
- [x] Implement add to wishlist logic
- [x] Implement remove from wishlist logic
- [x] Persist wishlist to Firestore
- [x] Sync wishlist on login

### 14. Wishlist UI
- [x] Create favorites/wishlist page
- [x] Display favorited products in grid
- [x] Add "Add to Cart" button for each item
- [x] Add remove from wishlist button
- [x] Implement empty wishlist state
- [x] Add wishlist counter badge on nav

---

## Phase 7: Checkout Process

### 15. Checkout Page UI
- [x] Create checkout page layout
- [x] Display order summary with product list
- [x] Show product thumbnails, names, variants
- [x] Add quantity adjusters in checkout
- [ ] Implement item options menu (remove, save for later)
- [x] Create shipping information section
- [x] Create payment method section
- [x] Display saved payment methods
- [x] Add card type icons (Visa, Mastercard, etc.)
- [x] Show price breakdown (items total, shipping, discount, subtotal)
- [x] Create large "Pay" button
- [x] Add back navigation

### 16. Shipping Address
- [x] Create address form component
- [x] Implement address validation
- [x] Add "Save address" functionality
- [x] Display saved addresses selector
- [x] Allow editing/deleting saved addresses
- [x] Set default shipping address

### 17. Payment Integration (⚠️ MOCK DATA - NOT REAL PAYMENT)
- [ ] Set up Stripe account
- [ ] Install Stripe SDK
- [ ] Create Stripe payment intent API endpoint
- [ ] Implement Stripe Elements for card input
- [ ] Add payment method save functionality
- [x] Display saved payment methods (UI only)
- [ ] Implement payment processing (currently mock)
- [ ] Handle payment success/failure
- [x] Add loading states during payment

### 18. Discount Codes
- [ ] Create discount code input field
- [ ] Implement discount validation logic
- [ ] Apply discount to total
- [ ] Display discount amount in price breakdown
- [ ] Create Firestore collection for discount codes (admin)

---

## Phase 8: Order Management

### 19. Order Confirmation
- [x] Create order confirmation page
- [x] Display order number
- [x] Show estimated delivery date
- [x] Display order summary
- [x] Add "Track Order" link
- [ ] Send order confirmation email (⚠️ NOT IMPLEMENTED)
- [x] Clear cart after successful order

### 20. Order History
- [x] Create orders collection in Firestore
- [x] Implement create order function
- [x] Create order history page (in user account)
- [x] Display list of past orders
- [x] Show order status for each order
- [x] Add "View Details" for each order
- [x] Create order detail page
- [x] Implement order tracking (basic status)

---

## Phase 9: User Account

### 21. User Profile
- [x] Create user account page/dashboard
- [x] Display user information
- [x] Create edit profile form
- [x] Implement update profile logic
- [x] Add change password functionality
- [x] Upload/change profile photo
- [x] Update phone number

### 22. Account Settings
- [x] Create settings page
- [x] Add notification preferences
- [x] Implement email notification toggles
- [x] Add sign out functionality
- [ ] Create "Delete Account" option (optional)

### 23. Address & Payment Management
- [x] Create "Manage Addresses" section
- [x] Display all saved addresses
- [x] Add/edit/delete address functionality
- [x] Set default address
- [x] Create "Manage Payment Methods" section
- [x] Display saved cards (masked)
- [x] Add/remove payment methods
- [x] Set default payment method

---

## Phase 10: Admin Dashboard (Basic)

### 24. Admin Authentication
- [x] Add admin role to User type
- [x] Create admin-only routes
- [x] Implement admin authentication check
- [x] Create admin dashboard layout

### 25. Product Management
- [x] Create product list view for admin
- [x] Implement add new product form
  - [x] Product name, description
  - [x] Category selector
  - [x] Price and sale price inputs
  - [x] Size options (multi-select)
  - [x] Color options with color picker
  - [x] Stock quantity
- [x] Add product image upload (multiple images)
- [x] Implement edit product functionality
- [x] Implement delete product functionality
- [x] Add product publish/unpublish toggle

### 26. Order Management (Admin)
- [x] Create order list view for admin
- [x] Display order details
- [x] Implement order status update
- [x] Add order filtering (status, date)
- [x] Show customer information
- [x] Add order search functionality

---

## Phase 11: Polish & Optimization

### 27. UI/UX Polish
- [x] Implement consistent loading states
- [ ] Add smooth transitions/animations
- [x] Optimize mobile touch interactions
- [ ] Add error boundaries
- [x] Implement form validation with clear error messages
- [x] Add success/error toast notifications
- [x] Ensure consistent spacing and typography
- [x] Test and fix responsive design issues
- [x] Add hover states for interactive elements
- [x] Implement focus states for accessibility

### 28. Performance Optimization
- [ ] Optimize images (WebP format, compression)
- [ ] Implement image lazy loading
- [ ] Add blur placeholder for images
- [ ] Code splitting for routes
- [ ] Optimize bundle size
- [ ] Implement caching strategy
- [ ] Add service worker for PWA
- [ ] Optimize Firestore queries (pagination, indexing)
- [ ] Run Lighthouse audit and fix issues

### 29. SEO Optimization
- [ ] Add dynamic meta tags for all pages
- [ ] Implement Open Graph tags
- [ ] Add structured data (JSON-LD) for products
- [ ] Generate sitemap.xml
- [ ] Create robots.txt
- [ ] Add canonical URLs
- [ ] Optimize page titles and descriptions
- [ ] Add alt text to all images

### 30. Security
- [ ] Review and update Firestore security rules
- [ ] Implement input validation on all forms
- [ ] Add rate limiting to API routes
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs (XSS prevention)
- [ ] Use HTTPS only
- [ ] Review authentication flow security
- [ ] Implement secure session management
- [ ] Add Content Security Policy headers

---

## Phase 12: Testing & Quality Assurance

### 31. Testing
- [ ] Set up testing framework (Jest, React Testing Library)
- [ ] Write unit tests for utility functions
- [ ] Write component tests for critical components
- [ ] Write integration tests for user flows
- [ ] Test authentication flows
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test payment integration (sandbox mode)
- [ ] Perform cross-browser testing
- [ ] Perform mobile device testing
- [ ] Test accessibility with screen readers

### 32. Bug Fixes & Edge Cases
- [ ] Handle network errors gracefully
- [ ] Test offline functionality
- [ ] Handle expired sessions
- [ ] Test with empty states (no products, empty cart, etc.)
- [ ] Test concurrent cart updates
- [ ] Handle payment failures
- [ ] Test with various screen sizes
- [ ] Fix any console errors/warnings

---

## Phase 13: Deployment & Launch

### 33. Pre-deployment
- [ ] Set up production Firebase project
- [ ] Configure production environment variables
- [ ] Set up Firebase Hosting
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL certificate
- [ ] Configure CDN
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics (Google Analytics)

### 34. Deployment
- [ ] Build production bundle
- [ ] Deploy to Firebase Hosting
- [ ] Test production deployment
- [ ] Set up CI/CD pipeline (GitHub Actions, etc.)
- [ ] Create deployment documentation

### 35. Post-launch
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Collect user feedback
- [ ] Track success metrics (conversion rate, etc.)
- [ ] Create backup strategy
- [ ] Set up database backups

---

## Future Enhancements (Phase 2+)

### 36. Reviews & Ratings
- [ ] Create review/rating system
- [ ] Add review form on product page
- [ ] Display reviews with pagination
- [ ] Implement rating calculation
- [ ] Add helpful/not helpful votes on reviews

### 37. Advanced Features
- [ ] Product comparison feature
- [ ] Advanced search with filters
- [ ] AI-based product recommendations
- [ ] Email marketing integration
- [ ] Loyalty program/points system
- [x] Multi-language support (i18n) - English & Thai implemented
- [x] Multi-currency support - USD, THB, EUR, GBP, JPY
- [ ] Live chat support
- [ ] Push notifications

### 38. Analytics & Reporting
- [ ] Create analytics dashboard
- [ ] Track sales metrics
- [ ] Monitor popular products
- [ ] Generate sales reports
- [ ] Customer insights and behavior tracking
- [ ] Conversion funnel analysis

---

## Notes

- Tasks marked with [ ] are incomplete
- Tasks marked with [x] are complete
- Priority: Focus on Phase 1-9 for MVP
- Admin features (Phase 10) can be developed in parallel or after MVP
- Testing should be ongoing throughout development
- Update this document as new requirements emerge
