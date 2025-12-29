# Pure BD Mart - Frontend

A modern e-commerce frontend built with Next.js 16, featuring a comprehensive shopping experience with cart management, user authentication, and admin dashboard.

## 🚀 Features

- **Modern UI**: Built with Tailwind CSS and Shadcn/UI components
- **Authentication**: NextAuth.js with Google OAuth and credentials login
- **Shopping Cart**: Local storage-based cart with real-time updates
- **Wishlist**: User wishlist functionality with local storage
- **Admin Dashboard**: Complete admin panel for product and order management
- **Responsive Design**: Mobile-first responsive design
- **SEO Optimized**: Next.js App Router with proper meta tags
- **Type Safety**: Full TypeScript support

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: React Query + Context API
- **Authentication**: NextAuth.js
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or pnpm

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pure-bd-mart-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in the required values.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

### Required
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXTAUTH_SECRET`: Random secret for NextAuth.js
- `NEXTAUTH_URL`: Your app URL (for production)

### Optional
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `SMTP_HOST`: Email SMTP host
- `SMTP_PORT`: Email SMTP port
- `SMTP_USER`: Email SMTP username
- `SMTP_PASS`: Email SMTP password
- `EMAIL_FROM`: From email address
- `MAILCHIMP_API_KEY`: Mailchimp API key
- `MAILCHIMP_AUDIENCE_ID`: Mailchimp audience ID

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Vercel Environment Variables
In your Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Admin dashboard pages
│   └── (WithCommonLayout)/ # Public pages with common layout
├── components/            # Reusable components
│   ├── module/           # Page-specific components
│   └── shared/           # Shared components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API calls
├── providers/            # Context providers
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📝 License

This project is private and proprietary.

## 📞 Support

For support, please contact the development team.
