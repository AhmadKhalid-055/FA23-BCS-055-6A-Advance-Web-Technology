# AdFlow Pro - Sponsored Listing Marketplace

A production-style classified ads marketplace with moderation, payment verification, analytics, and external media normalization built with Next.js + Supabase.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see below)

# 3. Run dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier)
3. Save your URL and API keys

### 2. Configure Environment

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_service_key
JWT_SECRET=change_me_in_production
CRON_SECRET=your_cron_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Create Database

1. Open Supabase SQL Editor
2. Create new query
3. Copy all content from `src/lib/database.sql`
4. Execute it

### 4. Run the App

```bash
npm run dev
```

Test at [http://localhost:3000](http://localhost:3000)

## 📚 Key Features

- ✅ Multi-role authentication (Client, Moderator, Admin)
- ✅ Ad submission and review workflow
- ✅ Payment verification system
- ✅ Automatic publishing/expiry with cron jobs
- ✅ Analytics dashboard
- ✅ External media URL normalization
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript

## 🏗️ Project Structure

```
src/
├── app/api/               # API Routes
│   ├── auth/             # Authentication
│   ├── ads/              # Ad management
│   ├── client/           # Client endpoints
│   ├── moderator/        # Moderation
│   ├── admin/            # Admin endpoints
│   └── cron/             # Cron jobs
├── components/            # React components
├── lib/                   # Utilities
├── store/                 # Zustand state
├── types/                 # TypeScript types
└── app/                   # Pages
```

## 👥 User Roles

| Role | Can Do |
|------|--------|
| Client | Create ads, submit payments, view own listings |
| Moderator | Review ads, flag suspicious content |
| Admin | Verify payments, publish ads, manage system |

## 🔄 Ad Workflow

```
Draft → Submitted → Under Review → Payment Pending → 
Payment Verified → Scheduled → Published → Expired → Archived
```

## 📊 API Endpoints

**Public:**
- `GET /api/ads` - List active ads
- `GET /api/packages` - Get pricing packages
- `GET /api/questions/random` - Learning question

**Protected (Client):**
- `POST /api/ads` - Create new ad
- `POST /api/client/payments` - Submit payment
- `GET /api/client/dashboard` - View my ads

**Protected (Moderator):**
- `GET /api/moderator/review-queue` - Ads to review
- `PATCH /api/moderator/review-queue` - Approve/reject

**Protected (Admin):**
- `GET /api/admin/payments` - Payment queue
- `PATCH /api/admin/payments` - Verify payment
- `PATCH /api/admin/publish` - Publish ad
- `GET /api/admin/analytics` - Dashboard data

**Cron:**
- `POST /api/cron/publish-scheduled` - Auto-publish
- `POST /api/cron/expire-ads` - Auto-expire
- `POST /api/health/db` - Health check

## 🚀 Deploy to Vercel

1. Push repo to GitHub
2. Connect to Vercel
3. Add environment variables
4. Set up cron jobs in Vercel dashboard

### Cron Job Setup

In Vercel dashboard, create scheduled functions:

```
POST /api/cron/publish-scheduled  →  Every hour
POST /api/cron/expire-ads         →  Every day at midnight  
POST /api/health/db               →  Every 5 minutes
```

## 📋 Development Checklist

- [ ] Supabase project created  
- [ ] .env.local configured
- [ ] Database schema created
- [ ] App runs locally
- [ ] Can register account
- [ ] Can create ad
- [ ] Payment submission works
- [ ] Deployed to Vercel
- [ ] Cron jobs scheduled

## 🧪 Test the App

1. Register at `/auth/register`
2. Create ad at `/dashboard/client`
3. As moderator, review at `/dashboard/moderator`
4. As admin, verify payment at `/dashboard/admin`
5. Ad appears at `/explore` when published

## 🛠️ Build for Production

```bash
npm run build
npm run start
```

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

**npm install fails:**
```bash
npm install --legacy-peer-deps
```

**Environment variables not loading:**
- Restart dev server after updating .env.local
- Check variable names don't have typos

**Supabase connection error:**
- Verify URL and keys in .env.local
- Check project is active in Supabase dashboard

---

**Advanced MERN Stack Course Project** | 2026
