# E-Commerce Web App

Modern shopping platform for small businesses built with Next.js 16, TypeScript, Tailwind CSS, Ant Design, and Firebase.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Ant Design
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payment**: Stripe
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase account
- Stripe account (for payment integration)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-webapp
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- Firebase configuration (API key, project ID, etc.)
- Stripe keys (publishable and secret)
- Admin emails

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Enable Firebase Storage
5. Copy your Firebase config to `.env.local`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Deploy

```bash
firebase deploy
```

## Project Structure

```
├── app/                  # Next.js 16 App Router pages
├── components/          # Reusable React components
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── WishlistContext.tsx
├── lib/                # Utilities and helpers
│   └── firebase.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── public/             # Static assets
└── .docs/              # Documentation
    ├── 01-spec.md      # Project specification
    └── 02-todos.md     # Development todos
```

## Features

### Phase 1: MVP
- ✅ User authentication (Email/Password, Google OAuth)
- ✅ Product catalog with filtering
- ✅ Product detail page
- ✅ Shopping cart
- ✅ Wishlist/Favorites
- 🚧 Checkout process
- 🚧 Order management
- 🚧 Responsive design (mobile + desktop)

### Phase 2: Enhanced Features
- ⏳ Payment gateway integration (Stripe)
- ⏳ User profile and order history
- ⏳ Email notifications
- ⏳ Admin dashboard

### Phase 3: Optimization
- ⏳ Performance optimization
- ⏳ SEO optimization
- ⏳ Analytics and reporting

## Documentation

- [Project Specification](.docs/01-spec.md)
- [Development Todos](.docs/02-todos.md)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private project for small business use.
