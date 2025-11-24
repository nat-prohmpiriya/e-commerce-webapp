# 🛍️ Modern E-Commerce Web Application

A full-featured e-commerce platform built with Next.js 16, TypeScript, Firebase, and Stripe. Features include product management, shopping cart, reviews, multi-language support, and a comprehensive admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![Stripe](https://img.shields.io/badge/Stripe-Latest-purple)

## ✨ Features

### Customer Features
- 🔐 **Authentication** - Email/Password & Google OAuth
- 🛒 **Shopping Cart** - Persistent cart with Firestore & localStorage sync
- ❤️ **Wishlist** - Save favorite products
- 💳 **Checkout** - Secure payment with Stripe
- 🎟️ **Discount Codes** - Apply promo codes at checkout
- ⭐ **Product Reviews** - Rate and review products with helpful votes
- 📦 **Order History** - Track orders with status updates
- 👤 **User Profile** - Manage profile, addresses, and payment methods
- 🌐 **Multi-language** - English & Thai support
- 💱 **Multi-currency** - USD, THB, EUR, GBP, JPY

### Admin Features
- 📊 **Dashboard** - Overview with key metrics
- 📦 **Product Management** - CRUD operations with image upload
- 🗂️ **Category Management** - Organize products
- 📋 **Order Management** - View and update order status
- 💬 **Review Management** - Moderate customer reviews
- 👥 **User Management** - Manage roles and permissions
- 🎟️ **Discount Management** - Create and manage promo codes

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payment**: Stripe
- **State Management**: React Context API
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Stripe account (for payments)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
   - Firebase credentials
   - Stripe API keys
   - Base URL

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔥 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password & Google)
3. Create a Firestore database
4. Set up Firebase Storage
5. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

## 💳 Stripe Setup

1. Create a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys (Publishable and Secret keys)
3. Add keys to `.env.local`
4. For testing, use Stripe's test card: `4242 4242 4242 4242`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── admin/         # Admin dashboard
│   │   ├── products/      # Product pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout flow
│   │   └── account/       # User account
│   └── api/               # API routes
├── components/            # Reusable components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🔐 Admin Access

To create an admin user:
1. Register a normal account
2. Go to Firebase Console > Firestore
3. Find the user document in `users` collection
4. Update the `role` field to `admin`

## 🧪 Testing

### Test Accounts
- Customer account: Create via registration
- Admin account: Follow admin access steps above

### Test Payment
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test Discount Codes
Create discount codes in admin panel and test during checkout.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 Key Features Implementation

### State Management
- Context API for global state
- Persistent cart with Firestore & localStorage
- Optimistic UI updates

### Security
- Firestore security rules
- Role-based access control
- Protected routes
- Input validation

### Performance
- Image optimization (WebP, AVIF)
- Code splitting
- Lazy loading
- Server-side rendering

### SEO
- Dynamic meta tags
- Open Graph tags
- Sitemap ready
- Structured data ready

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Your Name - Portfolio Project

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Stripe for payment processing
- Vercel for hosting

---

**Note**: This is a portfolio/demo project. For production use, additional security audits and testing are recommended.
