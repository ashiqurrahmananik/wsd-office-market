# WSD Office Market

Internal WSD office marketplace for buying, selling, giving away and bidding on office food/items.

## Stack
- Next.js latest stable + TypeScript
- Tailwind CSS
- Supabase Auth/PostgreSQL/Storage
- Vercel

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run `npm run dev`

## Supabase
Run `supabase/schema.sql` in the dedicated `office-food-market` project. Turn **Email Confirmations OFF** in Supabase Auth if you want immediate signup.

For admin access, create an account, then set its profile flag:

```sql
update public.profiles set is_admin = true where id = 'YOUR_USER_UUID';
```

## Vercel
Add the two `NEXT_PUBLIC_` Supabase environment variables to the Vercel project. Never put a service-role key in frontend code.
