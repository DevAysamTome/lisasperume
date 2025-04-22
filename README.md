# Lisa Perfume E-commerce Website

A modern e-commerce website built with Next.js and Firebase, featuring a beautiful user interface and a comprehensive admin panel.

## Features

- Modern, responsive design
- Product catalog with categories
- Admin control panel
- Product management
- Order management
- Cash on delivery payment option
- Firebase authentication
- Image upload and storage

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)
- NextAuth.js
- Headless UI
- Heroicons

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lisa-perfume-web.git
cd lisa-perfume-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── admin/            # Admin panel components
│   └── layout/           # Layout components
└── lib/                  # Utility functions and configurations
    └── firebase.ts       # Firebase configuration
```

## Admin Panel

The admin panel is accessible at `/admin` and includes:

- Dashboard with statistics
- Product management
- Order management
- Category management
- Settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
