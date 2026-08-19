import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyBids() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bids } = await supabase
    .from("bids")
    .select("id,amount,created_at,listings(id,title,image_url,status,bid_end_time)")
    .eq("bidder_id", user.id)
    .order("created_at", { ascending: false });

  // Dedupe to one row per listing, keeping the bidder's highest bid on each.
  const byListing = new Map<string, any>();
  for (const b of bids || []) {
    const listing = Array.isArray(b.listings) ? b.listings[0] : b.listings;
    if (!listing) continue;
    const existing = byListing.get(listing.id);
    if (!existing || b.amount > existing.amount) byListing.set(listing.id, b);
  }
  const rows = Array.from(byListing.values());

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-black">My Bids 🔨</h1>
      {rows.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <div className="text-5xl">🔨</div>
          <h2 className="mt-3 text-2xl font-black">No bids yet</h2>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {rows.map((b) => {
            const listing = Array.isArray(b.listings) ? b.listings[0] : b.listings;
            const ended = listing.status !== "AVAILABLE";
            return (
              <Link href={`/listing/${listing.id}`} key={listing.id} className="card flex items-center gap-4 p-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-orange-50 text-3xl">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover" />
                  ) : (
                    "🍱"
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-black">{listing.title}</div>
                  <div className="text-sm text-stone-500">Your bid: ৳{b.amount}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${ended ? "bg-stone-100 text-stone-500" : "bg-orange-100 text-orange-700"}`}>
                  {ended ? (listing.status === "SOLD" ? "Ended" : "No winner") : "Live"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
