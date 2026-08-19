import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyPurchases() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id,amount,created_at,listings(id,title,image_url,pickup_location)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  const rows = purchases || [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-black">My Purchases 🎉</h1>
      {rows.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <div className="text-5xl">🛍️</div>
          <h2 className="mt-3 text-2xl font-black">No purchases yet</h2>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {rows.map((p) => {
            const listing = Array.isArray(p.listings) ? p.listings[0] : p.listings;
            if (!listing) return null;
            return (
              <Link href={`/listing/${listing.id}`} key={p.id} className="card flex items-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-orange-50 text-3xl">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover" />
                  ) : (
                    "🍱"
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-black">{listing.title}</div>
                  <div className="text-sm text-stone-500">📍 {listing.pickup_location}</div>
                </div>
                <b className="text-lg">৳{p.amount}</b>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
