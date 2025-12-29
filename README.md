# Pure BD Mart - Frontend

A modern e-commerce frontend built with Next.js 16.1.1, featuring a comprehensive shopping experience with cart management, user authentication, and admin dashboard.

## 🚀 Features

- **Modern UI**: Built with Tailwind CSS and Shadcn/UI components
- **Authentication**: NextAuth.js with Google OAuth and credentials login
- **Shopping Cart**: Local storage-based cart with real-time updates
- **Wishlist**: User wishlist functionality with local storage
- **Admin Dashboard**: Complete admin panel for product and order management
- **Advanced Filtering**: Deal of the Day and Best Selling product filters
- **Responsive Design**: Mobile-first responsive design
- **SEO Optimized**: Next.js App Router with proper meta tags
- **Type Safety**: Full TypeScript support
- **Security**: Latest Next.js version with all security patches

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI + Radix UI
- **State Management**: React Query + Context API
- **Authentication**: NextAuth.js v4
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel (optimized)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or pnpm

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pure-bd-mart-frontend
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here

   # API Configuration
   NEXT_PUBLIC_API_URL=https://pure-bd-mart-backend.vercel.app/api

   # Optional: For local development
   # NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Install dependencies**
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

### ✅ Current Status: Ready for Deployment
- ✅ **Next.js 16.1.1**: Latest secure version installed
- ✅ **Zero Security Vulnerabilities**: All dependencies updated and secure
- ✅ **Build Successful**: All 30 pages generated successfully
- ✅ **Vercel Configuration**: Optimized for Vercel deployment

### Option 1: GitHub Integration (Recommended)
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update to Next.js 16.1.1 and fix security issues"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" → Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In your Vercel project settings → Environment Variables, add:

   **Required:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
   NEXTAUTH_SECRET=your-generated-secret-here
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   ```

   **Optional (for features):**
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   MAILCHIMP_API_KEY=your-mailchimp-api-key
   MAILCHIMP_AUDIENCE_ID=your-mailchimp-audience-id
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Your app will be live at `https://your-project-name.vercel.app`

### 🛠️ Troubleshooting Vercel Deployment

If you encounter build errors:

1. **Schema Validation Error** (`nodeVersion` property not allowed):
   - ✅ **Fixed**: Updated `vercel.json` to use only valid properties
   - The config now only includes `framework` and `functions` settings

2. **Middleware Issues** (deprecated middleware file):
   - ✅ **Fixed**: Moved `middleware.js` from root to `app/middleware.js`
   - Updated to Next.js 13+ app router format

3. **Build Timeouts** or **Settings API Errors**:
   - ✅ **Fixed**: Enhanced `useSettings` hook with better SSR handling
   - Added retry logic and client-side only execution
   - Settings API calls are now properly isolated to client-side

4. **Environment Variables Missing**:
   - Ensure all required variables are set in Vercel dashboard
   - Check that `NEXT_PUBLIC_API_URL` points to your backend API
   - Verify `NEXTAUTH_SECRET` is a secure random string

5. **Build Logs Loading Forever**:
   - Clear Vercel cache: Go to your project → Settings → Advanced → Clear Build Cache
   - Re-deploy the project
   - Check that all dependencies are properly installed

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
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
