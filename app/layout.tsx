import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/MobileNav";

export const metadata = {
  title: "WSD Office Market",
  description: "Don't eat it. Sell it. 😋",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  let displayName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name,is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = !!profile?.is_admin;
    displayName = profile?.display_name || user.user_metadata?.display_name || user.email || "";
  }

  const links = [
    { href: "/", label: "🏠 Home" },
    { href: "/browse", label: "🍱 Browse" },
    { href: "/sell", label: "💰 Sell" },
    ...(user ? [
      { href: "/my-listings", label: "📦 My Listings" },
      { href: "/my-bids", label: "🔨 My Bids" },
      { href: "/my-purchases", label: "🛍️ My Purchases" },
      { href: "/profile", label: "👤 Profile" },
    ] : []),
    ...(isAdmin ? [{ href: "/admin", label: "🛠️ Admin" }] : []),
  ];

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="shrink-0 text-xl font-black tracking-tight">
              WSD <span className="text-orange-500">Office Market</span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-bold lg:flex">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-orange-500">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              {user ? (
                <>
                  <span className="max-w-32 truncate text-sm font-bold">{displayName}</span>
                  <form action="/auth/signout" method="post">
                    <button className="btn btn-secondary text-sm">Sign Out</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary text-sm">Sign In</Link>
                  <Link href="/signup" className="btn btn-primary text-sm">Sign Up</Link>
                </>
              )}
            </div>

            <MobileNav
              links={links}
              user={!!user}
              displayName={displayName}
            />
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-orange-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-stone-500">
            Developed by <span className="font-black text-stone-700">Ashiqur Rahman Anik</span>
            {" · "}WSD Office Market
          </div>
        </footer>
      </body>
    </html>
  );
}
