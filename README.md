<div align="center">

# 🛒 Pure BD Mart — Frontend

**A production-ready e-commerce platform built with Next.js 16, TypeScript, and modern web technologies.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](#)

[Live Demo](#) · [Backend Repo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📌 Overview

Pure BD Mart is a full-featured e-commerce web application built for the Bangladeshi market with support for international users. It includes a customer-facing storefront, a fully functional admin dashboard, and seamless integration with a REST API backend — all optimized for performance and SEO with Next.js App Router.

---

## ✨ Features

| Area                     | Details                                                 |
| ------------------------ | ------------------------------------------------------- |
| 🔐 **Authentication**    | NextAuth.js with Google OAuth & credentials-based login |
| 🛒 **Shopping Cart**     | Real-time cart with localStorage persistence            |
| ❤️ **Wishlist**          | Save and manage favorite products                       |
| 🧑‍💼 **Admin Dashboard**   | Full product and order management panel                 |
| 🔍 **Advanced Filters**  | Deal of the Day, Best Selling, and category filters     |
| 📱 **Responsive Design** | Mobile-first layout across all screen sizes             |
| ⚡ **Performance**       | Next.js App Router with SSR, SSG, and ISR support       |
| 🔒 **Security**          | Zero vulnerabilities — all dependencies up to date      |
| 🌐 **SEO Optimized**     | Proper metadata, Open Graph, and structured routes      |
| 🧩 **Type Safety**       | Strict TypeScript throughout the entire codebase        |

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js 16.1.1](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI + Radix UI
- **Icons:** Lucide React + React Icons
- **Animations:** Framer Motion

### State & Data

- **State Management:** React Context API
- **Server State:** TanStack React Query
- **Forms:** React Hook Form + Zod validation

### Auth & Deployment

- **Authentication:** NextAuth.js v4
- **Deployment:** Vercel

---

## 📁 Project Structure

```
pure-bd-mart-frontend/
├── app/
│   ├── api/                    # Next.js API routes
│   ├── dashboard/              # Admin dashboard pages
│   └── (WithCommonLayout)/     # Public pages with shared layout
├── components/
│   ├── module/                 # Page-specific feature components
│   └── shared/                 # Reusable UI components
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities, API clients, helpers
├── providers/                  # Global context providers
└── public/                     # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**, **yarn**, or **pnpm**

### Local Development

**1. Clone the repository**

```bash
git clone <repository-url>
cd pure-bd-mart-frontend
```

**2. Install dependencies**

```bash
npm install
# or
yarn install
```

**3. Configure environment variables**

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your values (see [Environment Variables](#-environment-variables) below).

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

### Required

| Variable              | Description                                     |
| --------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL                       |
| `NEXTAUTH_SECRET`     | Secure random string for NextAuth.js            |
| `NEXTAUTH_URL`        | Application URL (e.g., `http://localhost:3000`) |

### Optional

| Variable                | Description                  |
| ----------------------- | ---------------------------- |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID       |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret   |
| `SMTP_HOST`             | Email SMTP server host       |
| `SMTP_PORT`             | Email SMTP server port       |
| `SMTP_USER`             | SMTP username                |
| `SMTP_PASS`             | SMTP password / app password |
| `EMAIL_FROM`            | Sender email address         |
| `MAILCHIMP_API_KEY`     | Mailchimp API key            |
| `MAILCHIMP_AUDIENCE_ID` | Mailchimp audience/list ID   |

---

## 📜 Available Scripts

```bash
npm run dev          # Start the development server
npm run build        # Create a production build
npm run start        # Run the production build locally
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix ESLint errors
npm run type-check   # Run TypeScript type checking
```

---

## ☁️ Deployment

This project is optimized for deployment on **Vercel**.

### Option 1 — GitHub Integration (Recommended)

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repository.
3. Vercel auto-detects the Next.js configuration.
4. Add the required environment variables in **Project Settings → Environment Variables**.
5. Deploy — Vercel will auto-deploy on every push to `main`.

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🐛 Troubleshooting

<details>
<summary><b>Schema Validation Error on Vercel</b></summary>

If you see a `nodeVersion` property error, ensure your `vercel.json` only includes valid properties (`framework`, `functions`). This has been pre-fixed in the current config.

</details>

<details>
<summary><b>Middleware Issues</b></summary>

The middleware file has been moved from the root to `app/middleware.js` to comply with Next.js 13+ App Router conventions.

</details>

<details>
<summary><b>Build Timeouts / Settings API Errors</b></summary>

The `useSettings` hook includes retry logic and is isolated to client-side execution only, preventing SSR-related failures.

</details>

<details>
<summary><b>Build Logs Loading Forever</b></summary>

Go to **Vercel Project → Settings → Advanced → Clear Build Cache**, then redeploy.

</details>

---

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is **private and proprietary**. Unauthorized use, distribution, or modification is not permitted.

---

<div align="center">

Built with ❤️ by [Md Parvej](https://github.com/) · Powered by [Next.js](https://nextjs.org/) & [Vercel](https://vercel.com/)

</div>
