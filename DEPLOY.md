# Deployment Guide

## Quick Start

### 1. Deploy to Vercel (5 min)
```
https://vercel.com/new → Import from GitHub → Zans365/little-moments → Deploy
```

### 2. Setup Supabase (10 min)
Follow: https://supabase.com/docs/guides/getting-started

Create project → Get API keys → Setup schema → Create storage

### 3. Add Env Vars to Vercel
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxx...
```

### 4. Redeploy
Vercel auto-redeploy on env change.

## Full Setup

See `supabase-schema.sql` for database schema.
Storage bucket: `memories` (private).

## Local Dev

```bash
npm install
npm run dev
# Update .env.local with Supabase keys
```

## Production

App ready. No additional config needed.
