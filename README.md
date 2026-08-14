# WSD Office Market

Fun internal office marketplace for WSD employees.

## Stack
Next.js + TypeScript + Tailwind CSS + Supabase + Vercel.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Add Supabase URL and anon key.
4. Run `supabase/schema.sql` in the dedicated `office-food-market` Supabase project.
5. `npm run dev`

## Branding
The application is branded **WSD Office Market**. Replace `public/wsd-logo.png` with the supplied official WSD logo if your local copy is available.

## Deployment
Push to GitHub repository `wsd-office-market` and import that repository into Vercel.
