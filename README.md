# AdFlow Pro - Sponsored Listing Marketplace

## 🌐 Live Access
**Live Project:** [https://fa-23-bcs-055-6-a-advance-web-techn.vercel.app/](https://fa-23-bcs-055-6-a-advance-web-techn.vercel.app/)

### 🔐 Test Credentials
Use these credentials to log in and explore the role-based dashboards:
- **Email:** `ahmad.khalid.regno.0055@gmail.com`
- **Password:** `Adflow123`

---

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-0.1.0-blue?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20Supabase%20%7C%20Tailwind-black?style=for-the-badge)

A high-performance, production-ready classified ads marketplace. Built with **Next.js 15**, **Supabase**, and **Tailwind CSS**, featuring a full moderation workflow, secure payment verification, and real-time analytics.

---

## 🚀 Quick Deployment

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
   ```

3. **Database Setup**
   Run the SQL schema located in `src/lib/database.sql` within your Supabase SQL Editor.

4. **Launch**
   ```bash
   npm run dev
   ```

---

## 💎 Key Features

- 🔐 **Secure Auth:** Multi-role system (Client, Moderator, Admin).
- 🛠️ **Ad Workflow:** Full lifecycle from Draft to Published/Expired.
- 💳 **Payment Verification:** Manual payment proof submission and admin verification.
- 📊 **Mainframe Analytics:** Real-time performance tracking for admins.
- 🕒 **Automated Tasks:** Cron jobs for ad publication and expiry.
- 📱 **Premium UI:** Futuristic, high-performance design with Tailwind CSS.

---

## 📂 Project Architecture

```bash
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # Role-based API logic
│   └── (routes)/         # UI Components and views
├── components/           # Reusable UI systems
├── lib/                  # Auth, Supabase, and utility logic
├── store/                # Global state with Zustand
└── types/                # Strict TypeScript definitions
```

---

## 👥 Role Matrix

| Role | Access Level | Responsibilities |
|---|-|---|
| **Client** | User | Listing creation, Payment proof, Personal Dashboard |
| **Moderator** | Security | Ad verification, Content quality assurance |
| **Admin** | Superuser | Financial verification, Global analytics, System control |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT + Supabase Auth logic
- **Styling:** Tailwind CSS + Lucide Icons
- **State Management:** Zustand
- **Validation:** Zod

---

## 🚀 Vercel Deployment

Deploy with one click to Vercel. Ensure all environment variables are added in the Vercel dashboard.

**Cron Job Configuration:**
- `/api/cron/publish-scheduled` (Every hour)
- `/api/cron/expire-ads` (Once daily)

---

**Developed by Ahmad Khalid** | *Advanced Web Technology Project 2026*
